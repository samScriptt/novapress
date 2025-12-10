import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Header } from '@/components/Header'; // Usando o novo Header animado
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { enUS } from 'date-fns/locale'; // Use enUS
import { TopicVoting } from '@/components/TopicVoting'; // Importe

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

interface HomeProps {
  searchParams: Promise<{ q?: string; page?: string }>; // Adicionado page
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q;
  
  // 1. Lógica de Paginação
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 10; // Requisito do usuário: max 10 por página
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 2. Construção da Query
  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' }) // Pede o total de itens para calcular páginas
    .order('created_at', { ascending: false })
    .range(from, to); // Aplica a paginação no banco

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
  }

  const { data: posts, count } = await query;

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Se for busca ou página > 1, não mostramos Hero Section, apenas Grid
  const isFirstPage = currentPage === 1;
  const showHero = !searchQuery && isFirstPage && posts && posts.length > 0;
  
  const heroPost = showHero ? posts![0] : null;
  const gridPosts = showHero ? posts!.slice(1) : (posts || []);

  return (
    <main className="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      
      {/* Novo Header Animado */}
      <Header />

      <div className="container mx-auto px-4 py-12 min-h-[60vh]">
        
        {/* Aviso de Busca */}
        {searchQuery && (
             <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                <h2 className="text-xl font-serif font-bold">Results for: "{searchQuery}"</h2>
             </div>
        )}

        {/* Hero Section (Apenas na página 1 e sem busca) */}
        {heroPost && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 border-b border-gray-300 dark:border-stone-800 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-8">
              <div className="aspect-video bg-gray-200 dark:bg-stone-800 overflow-hidden mb-4 rounded-sm relative group">
                <Link href={`/post/${heroPost.id}`}>
                    {heroPost.image_url && (
                    <img src={heroPost.image_url} alt={heroPost.title} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                    )}
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase shadow-md z-10">
                        {heroPost.category || 'Destaque'}
                    </span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-1 w-fit mb-4 uppercase">Headline</span>
              <Link href={`/post/${heroPost.id}`}>
                <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4 hover:underline decoration-2 underline-offset-4 text-black dark:text-white cursor-pointer">
                  {heroPost.title}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4 leading-relaxed font-serif">
                {heroPost.summary}
              </p>
            </div>
          </section>
        )}

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {gridPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <article className="group cursor-pointer flex flex-col h-full">
                <div className="aspect-[3/2] bg-gray-100 dark:bg-stone-800 overflow-hidden mb-4 rounded-sm relative">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>}
                   <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 uppercase">
                        {post.category || 'News'}
                    </span>
                </div>
                <div className="border-l-2 border-black dark:border-stone-600 pl-4 flex-grow group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors">
                  <h3 className="text-xl font-serif font-bold leading-snug mb-2 text-black dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed font-serif">
                    {post.summary}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        {(!posts || posts.length === 0) && (
            <div className="text-center py-20 opacity-50 font-serif">No news found on this page.</div>
        )}

        {/* Controles de Paginação */}
        <div className="mt-20 flex justify-between items-center border-t border-gray-200 dark:border-stone-800 pt-8">
            <div>
                {hasPrevPage ? (
                    <Link 
                        href={`/?page=${currentPage - 1}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 rounded hover:bg-gray-100 dark:hover:bg-stone-800 transition font-bold text-sm"
                    >
                        <ArrowLeft size={16} /> Previous
                    </Link>
                ) : <div />}
            </div>

            <span className="text-sm font-serif text-gray-500">
                Page {currentPage} of {totalPages}
            </span>

            <div>
                {hasNextPage ? (
                    <Link 
                        href={`/?page=${currentPage + 1}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-80 transition font-bold text-sm"
                    >
                        Next <ArrowRight size={16} />
                    </Link>
                ) : <div />}
            </div>
        </div>

      </div>

      <div className="container mx-auto px-4 pb-12">
        <TopicVoting />
      </div>

    </main>
  );
}