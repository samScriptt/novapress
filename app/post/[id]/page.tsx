import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostInteractions } from '@/components/PostInteractions'; // Caminho relativo ou alias
import { ThemeToggle } from '@/components/ThemeToggle';
import { Clock } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(20);

  return posts?.map(({ id }) => ({ id: String(id) })) || [];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  // Lógica de Tempo de Leitura (aprox 200 palavras/min)
  const words = post.content.split(/\s+/).length;
  const readTime = Math.ceil(words / 200);

  return (
    <article className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      
      {/* Navbar com Theme Toggle */}
      <nav className="border-b border-gray-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/80 py-4 sticky top-0 z-20 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 max-w-4xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif font-black text-2xl tracking-tighter hover:text-blue-700 dark:hover:text-blue-400 transition">
              NovaPress.
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white">
              ← Voltar
            </Link>
          </div>
        </div>
      </nav>

      {/* Conteúdo com animação de entrada */}
      <div className="container mx-auto px-4 max-w-4xl py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Meta Dados */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-sans mb-6">
          <span className="uppercase tracking-wider font-bold text-blue-700 dark:text-blue-400">Notícia</span>
          <span>•</span>
          <span>
            {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {readTime} min de leitura
          </span>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-tight text-black dark:text-white mb-8">
          {post.title}
        </h1>

        {/* Autor */}
        <div className="flex items-center gap-4 border-y border-gray-200 dark:border-stone-800 py-6 mb-12">
          <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold shadow-md">
            IA
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">Gemini 2.0</p>
            <p className="text-gray-500 text-sm">Editor Autônomo NovaPress</p>
          </div>
        </div>

        {/* Imagem com hover suave */}
        {post.image_url && (
          <figure className="mb-14 group">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img 
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <figcaption className="text-center text-xs text-gray-400 mt-2 font-sans">
              Fonte da imagem: Agregador de Notícias
            </figcaption>
          </figure>
        )}

        {/* Conteúdo Rico */}
        <div 
          className="prose prose-lg md:prose-xl max-w-none font-serif text-gray-800 dark:text-gray-300
                     leading-relaxed
                     prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white
                     prose-a:text-blue-600 dark:prose-a:text-blue-400
                     [&>h1]:mt-12 [&>h2]:mt-10 [&>p]:mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Componentes de Interação (Client Side) */}
        <div className="mt-10">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-gray-500 mb-4">Compartilhar</h3>
            <PostInteractions title={post.title} />
        </div>

        <hr className="my-16 border-gray-300 dark:border-stone-800" />

        {/* CTA Final */}
        <div className="bg-gradient-to-br from-black to-gray-800 dark:from-stone-800 dark:to-stone-900 text-white p-10 rounded-xl text-center shadow-2xl transform hover:scale-[1.01] transition duration-300">
          <h3 className="text-2xl font-serif font-bold mb-4">
            Curadoria Inteligente
          </h3>
          <p className="text-gray-300 font-sans text-sm mb-6 max-w-xl mx-auto">
            O NovaPress utiliza o poder do Gemini 2.0 para filtrar ruídos e entregar apenas o que importa no mundo da tecnologia.
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