import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';

// Configurations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role is required for uploads without login
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
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

  if (urlKey !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
      3. Constraint: Max 200 characters. Do NOT include hashtags or links in the text string.

      REQUIRED JSON OUTPUT:
      {
        "valid": true,
        "category": "String (Tech, World, AI, Economy, or Science)",
        "tags": ["tag1", "tag2", "tag3"],
        "title": "Compelling Headline",
        "html_content": "<p>Article body...</p>",
        "twitter_summary": "🔥 The viral hook text goes here..."
      }
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text());

    if (!aiResponse.valid) {
      return NextResponse.json({ message: 'AI rejected article.' });
    }

    // --- NULL SUMMARY FIX ---
    // If the AI fails to generate twitter_summary, use the original description or title as fallback
    const finalSummary = aiResponse.twitter_summary || targetArticle.description || targetArticle.title;


    // --- 2. IMAGE PROCESSING (CORRECTED) ---
    let finalImageUrl = targetArticle.urlToImage; // Default: original URL
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

            // Clean extension (ex: 'jpeg', 'png', 'webp')
            const extension = imageMimeType.split('/')[1] || 'jpg';
            const fileName = `post-${Date.now()}.${extension}`;

            // Upload to Supabase Storage (Bucket 'news-images')
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
                // Get the public URL from the bucket
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
        summary: finalSummary, // Using guaranteed summary
        original_url: targetArticle.url,
        image_url: finalImageUrl, // Using Storage URL (or original if upload failed)
        category: aiResponse.category,
        tags: aiResponse.tags
      })
      .select()
      .single();

    if (error) throw error;


    // --- 4. POST TO TWITTER ---
    try {
      const link = `${process.env.SITE_URL || 'https://novapress.vercel.app'}/post/${savedPost.id}`;

      // Tweet text WITHOUT dynamic hashtags
      function buildSafeTweet(summary: string, link: string) {
        const suffix = `\n\n👇 Read full story:\n${link}\n\n#NovaPress`;
        const maxSummaryLength = 280 - suffix.length;

        const safeSummary =
          summary.length > maxSummaryLength
            ? summary.slice(0, maxSummaryLength - 3) + '...'
            : summary;

        return safeSummary + suffix;
      }

      const tweetText = buildSafeTweet(finalSummary, link);

      let mediaId: string | null = null;

      // Reuse the buffer already downloaded for Storage (saves bandwidth)
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
