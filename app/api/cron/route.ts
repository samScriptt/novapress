import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';
import { esClient, POSTS_INDEX, ensurePostsIndex } from '@/utils/elasticsearch/client';

// Configurations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role is required for uploads without login
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: "gemini-3.1-flash-lite-preview", 
  generationConfig: { responseMimeType: "application/json" }
});

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export const dynamic = 'force-dynamic';

const DYNAMIC_SECTIONS = ['technology', 'business', 'science', 'general'];

export async function GET(req: NextRequest) {

  const authHeader = req.headers.get('authorization');
  const urlKey = req.nextUrl.searchParams.get('key');
  const CRON_SECRET = process.env.CRON_SECRET;



  try {
    const currentSection = DYNAMIC_SECTIONS[Math.floor(Math.random() * DYNAMIC_SECTIONS.length)];
    console.log(`🔄 NovaPress Cron: Scouting for trends in [${currentSection}]...`);

    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${currentSection}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;
    
    const newsRes = await fetch(apiUrl);
    const newsData = await newsRes.json();
    
    if (newsData.status !== 'ok') throw new Error(`NewsAPI Error: ${newsData.message}`);

    let targetArticle = null;

    for (const article of newsData.articles) {
      if (!article.title || article.title === '[Removed]') continue;
      if (!article.urlToImage) continue;

      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('original_url', article.url)
        .single();

      if (!existing) {
        targetArticle = article;
        break; 
      }
    }

    if (!targetArticle) {
      return NextResponse.json({ message: 'No new trending articles found.' });
    }

    console.log(`📝 Selected Trend: ${targetArticle.title}`);

    // --- 1. CONTENT GENERATION (AI) ---
    // ATUALIZAÇÃO NO PROMPT: Pedindo hashtags
    const prompt = `
      Role: You are the Editor-in-Chief and Social Media Manager of "NovaPress".
      Task: Create a long-form feature article AND a viral tweet based on this source.

      SOURCE DATA:
      Title: "${targetArticle.title}"
      Description: "${targetArticle.description}"
      Content: "${targetArticle.content}"

      WRITING GUIDELINES (Article):
      1. Language: English (Native, professional, analytical).
      2. Structure: Deep analysis, strong context, and future implications. Use Tailwind classes for HTML (e.g., <h2 class="text-2xl font-bold mt-6 mb-3">).
      3. Length: Substantial and detailed.

      WRITING GUIDELINES (Twitter/X):
      1. Style: Viral, engaging, "Must Click". Use a "Hook" sentence.
      2. Elements: Use 1-2 relevant emojis. Ask a provocative question or state a surprising fact.
      3. Constraint: Max 200 characters for the summary text itself. Do NOT include hashtags or links in the "twitter_summary" field.
      4. Hashtags: Generate exactly 2 highly relevant hashtags (e.g. #Trump #Economy).

      REQUIRED JSON OUTPUT:
      {
        "valid": true,
        "category": "String (Tech, World, AI, Economy, or Science)",
        "tags": ["tag1", "tag2", "tag3"],
        "title": "Compelling Headline",
        "html_content": "<p>Article body...</p>",
        "twitter_summary": "🔥 The viral hook text goes here...",
        "hashtags": ["#Tag1", "#Tag2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text());

    if (!aiResponse.valid) {
      return NextResponse.json({ message: 'AI rejected article.' });
    }

    // --- NULL SUMMARY FIX ---
    const finalSummary = aiResponse.twitter_summary || targetArticle.description || targetArticle.title;


    // --- 2. IMAGE PROCESSING ---
    let finalImageUrl = targetArticle.urlToImage; 
    let imageBuffer: Buffer | null = null;
    let imageMimeType = 'image/jpeg';

    if (targetArticle.urlToImage) {
        try {
            console.log('🖼️ Downloading original image...');
            const imageRes = await fetch(targetArticle.urlToImage);
            
            if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.status}`);

            const contentTypeHeader = imageRes.headers.get('content-type');
            const cleanContentType = contentTypeHeader?.split(';')[0]?.trim().toLowerCase();

            if (!cleanContentType || !cleanContentType.startsWith('image/')) {
                console.warn(`⚠️ Skipped upload: URL returned ${cleanContentType} instead of an image.`);
                throw new Error('Not an image');
            }

            const arrayBuffer = await imageRes.arrayBuffer();
            
            if (arrayBuffer.byteLength === 0) throw new Error('Empty image buffer');

            imageBuffer = Buffer.from(arrayBuffer);
            imageMimeType = cleanContentType;

            const extension = imageMimeType.split('/')[1] || 'jpg';
            const fileName = `post-${Date.now()}.${extension}`;

            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('news-images') 
                .upload(fileName, imageBuffer, {
                    contentType: imageMimeType,
                    upsert: false
                });

            if (uploadError) {
                console.error('Supabase upload error:', uploadError);
            } else {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('news-images')
                    .getPublicUrl(fileName);
                
                finalImageUrl = publicUrl;
                console.log('✅ Image saved to Storage:', finalImageUrl);
            }

        } catch (imgErr) {
            console.error('Failed to process image:', imgErr);
        }
    }

    // --- 3. SAVE TO DATABASE ---
    const { data: savedPost, error } = await supabase
      .from('posts')
      .insert({
        title: aiResponse.title,
        content: aiResponse.html_content,
        summary: finalSummary, 
        original_url: targetArticle.url,
        image_url: finalImageUrl, 
        category: aiResponse.category,
        tags: aiResponse.tags
      })
      .select()
      .single();

    if (error) throw error;

    // --- 3.5 INDEX IN ELASTICSEARCH (local study setup, non-blocking) ---
    try {
      await ensurePostsIndex();
      await esClient.index({
        index: POSTS_INDEX,
        id: savedPost.id.toString(),
        document: savedPost,
        refresh: true,
      });
      console.log('🔎 Post indexed in Elasticsearch.');
    } catch (esErr) {
      console.error('Elasticsearch indexing skipped/failed:', esErr);
    }

    // --- 4. POST TO TWITTER ---
    try {
      const link = `${process.env.SITE_URL || 'https://novapress.vercel.app'}/post/${savedPost.id}`;
      
      // Prepara as hashtags (Garante que são 2 e têm o #)
      const rawTags = aiResponse.hashtags || [];
      const safeTags = rawTags
        .slice(0, 2) // Garante apenas 2
        .map((t: string) => t.startsWith('#') ? t : `#${t}`)
        .join(' ');

      // LÓGICA ATUALIZADA DE CORTE (280 chars)
      function buildSafeTweet(summary: string, link: string, hashtags: string) {
        // Link encurtado do Twitter conta como 23 caracteres, mas usamos o link full aqui.
        // O Twitter conta qualquer URL como 23 chars no contador interno.
        const twitterLinkLength = 23; 
        const spacing = 4; // \n\n (2) + espaço entre link/hash (2)
        
        const suffixDisplay = `\n\n👇 Read full story:\n${link}\n\n${hashtags}`;
        
        // Tamanho ocupado pelos extras (Link, Hashtags, "Read full story", quebras de linha)
        // Nota: O texto fixo "👇 Read full story:\n\n\n" tem aprox 20 chars.
        // Vamos calcular o tamanho do sufixo real substituindo o link por 23 chars para ter segurança.
        
        const staticTextLen = 22; // "\n\n👇 Read full story:\n" + "\n\n"
        const suffixLength = staticTextLen + twitterLinkLength + hashtags.length;
        
        const maxSummaryLength = 280 - suffixLength;

        // Corta o resumo se necessário
        const safeSummary =
          summary.length > maxSummaryLength
            ? summary.slice(0, maxSummaryLength - 3) + '...'
            : summary;

        return safeSummary + suffixDisplay;
      }

      const tweetText = buildSafeTweet(finalSummary, link, safeTags);

      let mediaId: string | null = null;

      if (imageBuffer) {
          try {
              mediaId = await twitterClient.v1.uploadMedia(imageBuffer, {
                  mimeType: imageMimeType
              });
          } catch (twImgErr) {
              console.error('Twitter image upload error:', twImgErr);
          }
      }

      if (mediaId) {
          await twitterClient.v2.tweet({
              text: tweetText,
              media: { media_ids: [mediaId] }
          });
      } else {
          await twitterClient.v2.tweet({
              text: tweetText
          });
      }

      console.log('🐦 Tweet sent!');
  } catch (e: any) {
      console.error('Twitter failure:', e?.data || e);
  }


    return NextResponse.json({ 
      success: true, 
      category: aiResponse.category,
      title: aiResponse.title 
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
