import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Configuração do Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache: Revalida a cada 60 segundos para garantir velocidade, mas permite atualizações
export const revalidate = 60;

// Gera os parâmetros estáticos para as notícias recentes (Otimização SEO)
export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(20);

  return posts?.map(({ id }) => ({ id: String(id) })) || [];
}

// Definição da Props (Next.js 15/16 exige que params seja uma Promise)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  // 1. Aguardar os parâmetros (Mudança do Next.js 15+)
  const { id } = await params;

  // 2. Buscar a notícia no Banco
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  // Se não achar, retorna 404
  if (!post) {
    notFound();
  }

  return (
  <article className="min-h-screen bg-stone-50 text-stone-900 selection:bg-black selection:text-white">
    
    {/* Navbar */}
    <nav className="border-b border-gray-200 bg-white py-4 sticky top-0 z-10 backdrop-blur">
      <div className="container mx-auto px-4 max-w-4xl flex justify-between items-center">
        <Link href="/" className="font-serif font-black text-2xl tracking-tighter hover:text-blue-700 transition">
          NovaPress.
        </Link>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black">
          ← Voltar
        </Link>
      </div>
    </nav>

    {/* Conteúdo */}
    <div className="container mx-auto px-4 max-w-4xl py-16">

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-sans mb-6">
        <span className="uppercase tracking-wider font-bold text-blue-700">Notícia</span>
        <span>•</span>
        <span>
          {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
        </span>
        <span>•</span>
        <span className="italic">Leitura IA</span>
      </div>

      {/* Título */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-tight text-black mb-8">
        {post.title}
      </h1>

      {/* Autor */}
      <div className="flex items-center gap-4 border-y border-gray-200 py-6 mb-12">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold">
          IA
        </div>
        <div>
          <p className="font-bold text-gray-900">I.A</p>
          <p className="text-gray-500 text-sm">Editor Autônomo NovaPress</p>
        </div>
      </div>

      {/* Imagem */}
      {post.image_url && (
        <figure className="mb-14">
          <img 
            src={post.image_url}
            alt={post.title}
            className="w-full h-auto rounded-xl shadow-lg"
          />
          <figcaption className="text-center text-xs text-gray-400 mt-2 font-sans">
            Fonte da imagem: Agregador de Notícias
          </figcaption>
        </figure>
      )}

      {/* Conteúdo */}
      <div 
        className="prose prose-lg md:prose-xl max-w-none font-serif text-gray-800
                   leading-relaxed
                   [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-12
                   [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-10
                   [&>p]:mb-6"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {/* Divider */}
      <hr className="my-16 border-gray-300" />

      {/* CTA Final */}
      <div className="bg-gradient-to-br from-black to-gray-800 text-white p-10 rounded-xl text-center shadow-lg">
        <h3 className="text-2xl font-serif font-bold mb-4">
          Quer continuar informado?
        </h3>
        <p className="text-gray-300 font-sans text-sm mb-6 max-w-xl mx-auto">
          Todas as notícias do NovaPress são geradas automaticamente com base nas tendências mais relevantes do momento.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition"
        >
          Ver Mais Notícias
        </Link>
      </div>

    </div>
  </article>
);

}