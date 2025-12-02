import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Cliente Supabase (Apenas leitura usa a chave pública)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Força a página a não ter cache estático eterno (revalida a cada 60s)
export const revalidate = 60;

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-black">
            Nova<span className="text-blue-600">Press</span>.
          </h1>
          <span className="text-sm text-gray-500">
            Atualização Autônoma via IA
          </span>
        </div>
      </header>

      {/* Grid de Notícias */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
            <article key={post.id} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden flex flex-col">
              {post.image_url && (
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Tecnologia</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>

                <h2 className="text-xl font-bold mb-3 leading-tight hover:text-blue-600">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.summary}
                </p>

                {/* Para simplicidade, vamos renderizar o conteúdo em um modal ou página dedicada. 
                    Aqui, se você clicar, poderia ir para /post/[id]. 
                    Para este MVP, deixaremos visual apenas, ou linkando para a fonte se preferir.
                    Mas o ideal seria criar a página /post/[id]/page.tsx.
                */}
                 <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400">Por Gemini AI</span>
                    {/* Botão placeholder para leitura */}
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                      Ler Matéria &rarr;
                    </button>
                 </div>
              </div>
            </article>
          ))}
          
          {(!posts || posts.length === 0) && (
            <div className="col-span-full text-center py-20 text-gray-500">
              <p>O sistema ainda está buscando as primeiras notícias...</p>
              <p className="text-sm mt-2">Aguarde o próximo ciclo do Cron Job.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}