import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';

// 1. Configuração dos Clientes
// Usamos a Service Role para ter permissão de escrita
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Modelo Flash é mais rápido e barato para essa tarefa
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

const BLACKLIST_DOMAINS = 'prnewswire.com,businesswire.com,marketwatch.com,globenewswire.com';
const KEYWORDS = '(AI OR "Artificial Intelligence" OR Apple OR Google OR Microsoft OR "Startup" OR Crypto OR "Tech Trends")';

export const dynamic = 'force-dynamic'; // Garante que a rota não seja cachead estáticamente

export async function GET(req: NextRequest) {
  try {
    console.log('🔄 Iniciando Cron Job NovaPress (Modo Curadoria)...');

    // 1. Busca Refinada (EUA, Tech, excluindo lixo, filtrando por keywords)
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(KEYWORDS)}&language=en&sortBy=publishedAt&excludeDomains=${BLACKLIST_DOMAINS}&apiKey=${process.env.NEWS_API_KEY}`;
    
    const newsRes = await fetch(apiUrl);
    const newsData = await newsRes.json();

    if (newsData.status !== 'ok') throw new Error('Falha ao buscar NewsAPI');

    let targetArticle = null;

    // 2. Loop de verificação (Tenta achar um artigo válido)
    for (const article of newsData.articles) {
      // Filtros básicos de qualidade
      if (!article.url || !article.title || !article.urlToImage) continue;
      if (article.title.includes('[Removed]')) continue;

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
      return NextResponse.json({ message: 'Nenhuma notícia relevante nova encontrada.' }, { status: 200 });
    }

    console.log(`📝 Candidato selecionado: ${targetArticle.title}`);

    // 3. Prompt com "Reviewer Mode"
    // Instruímos o Gemini a recusar se for ruim.
    const prompt = `
      Atue como Editor Chefe do "NovaPress". Analise esta notícia:
      Título: "${targetArticle.title}"
      Descrição: "${targetArticle.description}"
      
      PASSO 1 - ANÁLISE DE QUALIDADE:
      O artigo parece ser apenas um Press Release de empresa, um anúncio de produto irrelevante ou spam? 
      Se SIM, retorne apenas a palavra: "REJECT".
      
      PASSO 2 - ESCRITA (Se passar na qualidade):
      Escreva uma notícia completa em HTML (sem tags html/body).
      - Use Português do Brasil.
      - Título <h1> impactante.
      - Subtítulo (Lead) em itálico logo após o título.
      - Use <h2> para separar seções.
      - Estilo jornalístico sério e direto (New York Times style).
      - Use classes Tailwind: <h1 class="text-3xl font-serif font-bold text-gray-900 mb-2">, <p class="text-gray-700 leading-relaxed mb-4">.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Verificação de Rejeição da IA
    if (responseText.includes('REJECT')) {
      console.log('❌ Artigo rejeitado pela IA (Qualidade/Spam).');
      // Opcional: Salvar URL numa tabela de 'blacklisted_urls' para não tentar de novo
      return NextResponse.json({ message: 'Artigo rejeitado pela IA.' }, { status: 200 });
    }

    const htmlContent = responseText.replace(/```html|```/g, '');
    
    // Gera resumo para social
    const summaryPrompt = `Crie um tweet curto (max 200 chars) e instigante sobre: ${targetArticle.title}. Sem hashtags, tom sério.`;
    const summaryRes = await model.generateContent(summaryPrompt);
    const summaryText = summaryRes.response.text();

    // 4. Salvar
    const { data: savedPost, error: dbError } = await supabase
      .from('posts')
      .insert({
        title: targetArticle.title, // Pode usar o título da IA se preferir extrair do HTML
        content: htmlContent,
        summary: summaryText,
        original_url: targetArticle.url,
        image_url: targetArticle.urlToImage,
      })
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    // 6. Postar no Twitter (Falha no Twitter não deve quebrar o processo todo, então usamos try/catch aninhado)
    let twitterStatus = 'skipped';
    try {
      // Nota: Linkando para o seu site, não para a fonte original
      // Assumindo que seu site está em process.env.SITE_URL
      const postLink = `${process.env.SITE_URL || 'http://localhost:3000'}/post/${savedPost.id}`; 
      const tweet = `🔥 Nova Edição: ${summaryText}\n\nLeia mais: ${postLink}`;
      
      await twitterClient.v2.tweet(tweet);
      twitterStatus = 'success';
    } catch (twError) {
      console.error('Erro ao postar no Twitter:', twError);
      twitterStatus = 'failed';
    }

    return NextResponse.json({ 
      success: true, 
      article: targetArticle.title, 
      twitter: twitterStatus 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Erro Crítico:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}