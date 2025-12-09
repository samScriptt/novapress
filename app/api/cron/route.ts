import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';

// Configurações (Mantenha suas chaves no .env.local)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Mantendo o modelo solicitado (2.5 flash ou 2.0 flash conforme sua lib)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // ou gemini-1.5-flash dependendo da disponibilidade
  generationConfig: { responseMimeType: "application/json" }
});

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export const dynamic = 'force-dynamic';

// Editorias dinâmicas para variar o conteúdo a cada execução
const DYNAMIC_SECTIONS = ['technology', 'business', 'science', 'general'];

export async function GET(req: NextRequest) {
  try {
    // 1. Definição Dinâmica de Tópico
    // Escolhe uma categoria aleatória para buscar tendências variadas
    const currentSection = DYNAMIC_SECTIONS[Math.floor(Math.random() * DYNAMIC_SECTIONS.length)];
    console.log(`🔄 NovaPress Cron: Scouting for trends in [${currentSection}]...`);

    // 2. Busca de Tendências Reais (Top Headlines US)
    // Usamos 'us' para garantir conteúdo nativo em inglês e relevância global
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${currentSection}&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;
    
    const newsRes = await fetch(apiUrl);
    const newsData = await newsRes.json();
    
    if (newsData.status !== 'ok') throw new Error(`NewsAPI Error: ${newsData.message}`);

    let targetArticle = null;

    // 3. Filtragem Inteligente
    // Pula artigos removidos, sem imagem ou já existentes
    for (const article of newsData.articles) {
      if (!article.title || article.title === '[Removed]') continue;
      if (!article.urlToImage) continue; // Exige imagem para qualidade visual

      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('original_url', article.url)
        .single();

      if (!existing) {
        targetArticle = article;
        break; // Pega o primeiro 'trending' válido que ainda não temos
      }
    }

    if (!targetArticle) {
      return NextResponse.json({ message: 'No new trending articles found in this cycle.' });
    }

    console.log(`📝 Selected Trend: ${targetArticle.title}`);

    // 4. Prompt "Senior Writer" (Inglês + Long-form)
    const prompt = `
      Role: You are the Editor-in-Chief of "NovaPress", a premium autonomous news portal.
      Task: Write a comprehensive, long-form feature article in English based on this source.

      SOURCE DATA:
      Title: "${targetArticle.title}"
      Description: "${targetArticle.description}"
      Content Snippet: "${targetArticle.content}"
      Source Name: "${targetArticle.source.name}"

      WRITING GUIDELINES:
      1. Language: English (Professional, engaging, journalistic tone like The Verge or NYT).
      2. Depth: Do not just summarize. Analyze the implications, provide context, and explain why this matters.
      3. Structure:
         - Engaging Headline (Catchy but accurate).
         - Strong Lead Paragraph (Who, what, where, when, why).
         - "The Big Picture" (Contextual analysis).
         - "Why It Matters" (Impact on industry/society).
      4. Formatting: Return ONLY the HTML body content (use <h2>, <p>, <ul>, <blockquote>). Use Tailwind classes for styling (e.g., <h2 class="text-2xl font-bold mt-8 mb-4">).
      5. Tags: Generate 3-5 relevant hashtags/keywords.
      6. Category: Assign one of: Tech, World, AI, Economy, Science.

      REQUIRED JSON OUTPUT FORMAT:
      {
        "valid": true,
        "category": "String (Tech, World, AI, Economy, or Science)",
        "tags": ["tag1", "tag2", "tag3"],
        "title": "Your Enhanced Headline Here",
        "html_content": "<p>Your long-form article content...</p>",
        "twitter_summary": "A punchy, click-worthy summary for X (max 200 chars)"
      }
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text());

    if (!aiResponse.valid) {
      return NextResponse.json({ message: 'AI rejected the article quality.' });
    }

    // 5. Salvar no Banco
    const { data: savedPost, error } = await supabase
      .from('posts')
      .insert({
        title: aiResponse.title,
        content: aiResponse.html_content,
        summary: aiResponse.twitter_summary,
        original_url: targetArticle.url,
        image_url: targetArticle.urlToImage,
        category: aiResponse.category,
        tags: aiResponse.tags
      })
      .select()
      .single();

    if (error) throw error;

    // 6. Postar no Twitter 
    try {
        const link = `${process.env.SITE_URL || 'https://novapress.vercel.app'}/post/${savedPost.id}`;

        let mediaId = null;

        if (targetArticle.urlToImage) {
            try {
                console.log('🖼️ Baixando imagem para o Twitter...');
                const imageRes = await fetch(targetArticle.urlToImage);
                const arrayBuffer = await imageRes.arrayBuffer();
                const imageBuffer = Buffer.from(arrayBuffer);

                // Upload para o Twitter (v1.1 é usada para upload de mídia, mesmo postando com v2)
                // Detecta se é PNG ou JPG pelo final da url ou assume jpg
                const isPng = targetArticle.urlToImage.toLowerCase().endsWith('.png');
                mediaId = await twitterClient.v1.uploadMedia(imageBuffer, { mimeType: isPng ? 'image/png' : 'image/jpeg' });
            } catch (imgError) {
                console.error('⚠️ Falha ao processar imagem (postaremos apenas texto):', imgError);
            }
        }

        if (mediaId) {
            await twitterClient.v2.tweet({
                text: (`[${aiResponse.category}] ${aiResponse.twitter_summary}\n\n${link}`),
                media: { media_ids: [mediaId] }
            });
        } else {
            await twitterClient.v2.tweet((`[${aiResponse.category}] ${aiResponse.twitter_summary}\n\n${link}`));
        }

    } catch(e) { console.log('Twitter fail', e); }

    return NextResponse.json({ 
      success: true, 
      trend: currentSection,
      title: aiResponse.title 
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}