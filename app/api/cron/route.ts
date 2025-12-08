import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';

// Categorias permitidas (para o Prompt)
const VALID_CATEGORIES = "Tech, Mundo, IA, Economia, Ciência";

// Configurações (Mantenha suas chaves aqui)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" } // FORÇA JSON
});

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('🔄 Cron V2: Buscando e Classificando...');

    // Busca ampla para pegar variedade de tópicos
    const keywords = '(Technology OR Economy OR "Artificial Intelligence" OR Science OR "World News")';
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;
    
    const newsRes = await fetch(apiUrl);
    const newsData = await newsRes.json();
    
    if (newsData.status !== 'ok') throw new Error(`Erro NewsAPI: ${newsData.message}`);

    let targetArticle = null;

    // Tenta achar uma notícia inédita
    for (const article of newsData.articles) {
      if (!article.title || article.title === '[Removed]') continue;

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

    if (!targetArticle) return NextResponse.json({ message: 'Nada novo.' });

    console.log(`📝 Processando: ${targetArticle.title}`);

    // Prompt Engenharia para JSON
    const prompt = `
      Atue como Editor Chefe do NovaPress. Analise esta notícia:
      Título: "${targetArticle.title}"
      Desc: "${targetArticle.description}"
      Content: "${targetArticle.content}"

      TAREFA:
      1. Classifique na categoria mais adequada entre: [${VALID_CATEGORIES}].
      2. Gere 3 a 5 tags relevantes (ex: "Bitcoin", "NVIDIA", "Geopolítica").
      3. Escreva a notícia em HTML (pt-BR, estilo jornalístico, use classes Tailwind).
      4. Gere um resumo curto para o Twitter.

      FORMATO DE RESPOSTA JSON OBRIGATÓRIO:
      {
        "valid": true, (ou false se for spam/inútil)
        "category": "String (uma das categorias permitidas)",
        "tags": ["tag1", "tag2"],
        "title": "Título em PT-BR",
        "html_content": "HTML string (apenas o body content, use h2, p, ul)",
        "twitter_summary": "Resumo curto"
      }
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text());

    if (!aiResponse.valid) {
      return NextResponse.json({ message: 'IA Rejeitou a notícia.' });
    }

    // Salvar no Banco
    const { data: savedPost, error } = await supabase
      .from('posts')
      .insert({
        title: aiResponse.title,
        content: aiResponse.html_content,
        summary: aiResponse.twitter_summary,
        original_url: targetArticle.url,
        image_url: targetArticle.urlToImage,
        category: aiResponse.category, // Campo Novo
        tags: aiResponse.tags          // Campo Novo
      })
      .select()
      .single();

    if (error) throw error;

    // Postar no Twitter (Opcional: descomente se quiser)
    try {
        const link = `${process.env.SITE_URL || 'https://novapress.vercel.app'}/post/${savedPost.id}`;
        await twitterClient.v2.tweet(`[${aiResponse.category}] ${aiResponse.twitter_summary}\n\n${link}`);
    } catch(e) { console.log('Twitter fail', e); }

    return NextResponse.json({ success: true, category: aiResponse.category });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}