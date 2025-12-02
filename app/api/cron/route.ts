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

export const dynamic = 'force-dynamic'; // Garante que a rota não seja cachead estáticamente

export async function GET(req: NextRequest) {
  try {
    // Verificação de segurança simples (opcional: verificar um token no header Authorization)
    // if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) { ... }

    console.log('🔄 Iniciando Cron Job NovaPress...');

    // 2. Buscar Notícias (Tecnologia/Business no Brasil)
    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${process.env.NEWS_API_KEY}`
    );
    const newsData = await newsRes.json();

    // --- INÍCIO DO DEBUG (ADICIONE ISSO) ---
    console.log('📡 Status NewsAPI:', newsData.status);
    console.log('📊 Total de Resultados:', newsData.totalResults);
    console.log('articles array length:', newsData.articles ? newsData.articles.length : 0);
    // --- FIM DO DEBUG ---

    if (newsData.status !== 'ok') throw new Error('Falha ao buscar NewsAPI');

    // 3. Encontrar uma notícia inédita
    let targetArticle = null;

    for (const article of newsData.articles) {
      if (!article.url || !article.title) continue;

      // Verifica se já existe no banco
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('original_url', article.url)
        .single();

      if (!existing) {
        targetArticle = article;
        break; // Achamos uma notícia nova! Parar o loop.
      }
    }

    if (!targetArticle) {
      return NextResponse.json({ message: 'Nenhuma notícia nova encontrada.' }, { status: 200 });
    }

    console.log(`📝 Processando: ${targetArticle.title}`);

    // 4. Gerar Conteúdo com Gemini
    const prompt = `
      Atue como um jornalista sênior de tecnologia do portal "NovaPress".
      Escreva uma notícia completa baseada neste título e descrição:
      Título: ${targetArticle.title}
      Descrição: ${targetArticle.description || 'Sem descrição'}
      Conteúdo Original (Snippet): ${targetArticle.content || ''}

      Regras:
      1. Escreva em Português do Brasil, tom profissional mas acessível.
      2. O output deve ser APENAS código HTML (sem tag <html> ou <body>, apenas o conteúdo interno como <p>, <h2>, <ul>).
      3. Use classes do Tailwind CSS para estilizar levemente (ex: <h2 class="text-2xl font-bold mt-4 mb-2">).
      4. Crie um título chamativo dentro de uma tag <h1>.
      5. Não invente fatos, baseie-se no input. Se for pouco, expanda explicando o contexto tecnológico.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const htmlContent = response.text().replace(/```html|```/g, ''); // Limpeza básica

    // Gerar um resumo curto para o Twitter
    const summaryPrompt = `Resuma a notícia "${targetArticle.title}" em uma frase instigante de até 200 caracteres para o Twitter. Sem hashtags.`;
    const summaryResult = await model.generateContent(summaryPrompt);
    const summaryText = summaryResult.response.text();

    // 5. Salvar no Supabase
    const { data: savedPost, error: dbError } = await supabase
      .from('posts')
      .insert({
        title: targetArticle.title,
        content: htmlContent,
        summary: summaryText,
        original_url: targetArticle.url,
        image_url: targetArticle.urlToImage,
      })
      .select()
      .single();

    if (dbError) throw new Error(`Erro ao salvar no DB: ${dbError.message}`);

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