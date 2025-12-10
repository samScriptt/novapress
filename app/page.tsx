import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ArrowRight, Clock, Hash, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { TopicVoting } from '@/components/TopicVoting'; // Importe

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

interface HomeProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q;
  const currentPage = Number(params.page) || 1;
  
  // Grid maior, então buscamos 12 itens (múltiplo de 3 e 4)
  const itemsPerPage = 9; 
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabase.from('posts').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);

  if (searchQuery) query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);

  const { data: posts, count } = await query;
  
  const heroPost = (!searchQuery && currentPage === 1 && posts?.length) ? posts[0] : null;
  const gridPosts = heroPost ? posts!.slice(1) : (posts || []);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black pt-20 pb-12">
      <Header />

      <div className="container mx-auto px-4">
        
        {/* Status Bar */}
        <div className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-widest text-zinc-400 dark:text-green-800/80 font-bold font-mono">
            <span>ROOT</span>
            <span>//</span>
            <span>NEWS_FEED</span>
            <span>//</span>
            <span className="text-black dark:text-green-500 animate-pulse">{searchQuery ? `QUERY=${searchQuery}` : 'LIVE_STREAM'}</span>
        </div>

        {/* HERO: Layout Técnico */}
        {heroPost && (
          <section className="mb-12 border-b border-zinc-200 dark:border-green-900/30 pb-12">
            <Link href={`/post/${heroPost.id}`} className="grid grid-cols-1 lg:grid-cols-12 gap-6 group">
                <div className="lg:col-span-8 relative overflow-hidden bg-zinc-200 dark:bg-green-900/10 border border-zinc-300 dark:border-green-900/50 rounded-sm">
                    {/* Linhas de scan decorativas */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
                    
                    {heroPost.image_url && (
                        // SEM GRAYSCALE AQUI
                        <img src={heroPost.image_url} alt="" className="w-full h-full object-cover opacity-100 group-hover:scale-[1.02] transition-all duration-700" />
                    )}
                    <div className="absolute top-0 left-0 bg-blue-600 text-white dark:bg-green-600 dark:text-black text-[10px] font-bold px-3 py-1 uppercase z-20 font-mono">
                        Priority::High
                    </div>
                </div>
                <div className="lg:col-span-4 flex flex-col justify-end">
                    <h2 className="text-2xl md:text-4xl font-bold leading-none mb-4 font-mono group-hover:text-blue-600 dark:group-hover:text-green-400 transition-colors">
                        <span className="text-blue-600 dark:text-green-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
                        {heroPost.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-green-400/80 text-xs leading-relaxed mb-6 border-l-2 border-zinc-300 dark:border-green-900 pl-3 font-mono">
                        {heroPost.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-[10px] text-zinc-400 dark:text-green-800 uppercase tracking-wider font-mono">
                        <span>ID: {heroPost.id}</span>
                        <span>{formatDistanceToNow(new Date(heroPost.created_at), { addSuffix: true })}</span>
                    </div>
                </div>
            </Link>
          </section>
        )}

        {/* GRID: 4 Colunas em telas grandes (XL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gridPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id} className="group flex flex-col h-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-green-900/30 hover:border-black dark:hover:border-green-500 transition-colors rounded-sm overflow-hidden">
                
                {/* Imagem do Card (Colorida) */}
                <div className="aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border-b border-zinc-100 dark:border-green-900/30">
                    {post.image_url ? (
                        // SEM GRAYSCALE AQUI TAMBÉM
                        <img src={post.image_url} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-green-900">
                            <Zap size={24} />
                        </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold font-mono uppercase text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                            {post.category || 'RAW'}
                        </span>
                    </div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold font-mono text-sm leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-green-400 transition-colors">
                        {post.title}
                    </h3>
                    
                    <div className="mt-auto pt-3 flex items-center justify-between text-[10px] text-zinc-400 dark:text-green-800 font-mono border-t border-zinc-100 dark:border-green-900/30">
                        <div className="flex items-center gap-1">
                            <Clock size={10} />
                            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        </div>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-600 dark:text-green-500" />
                    </div>
                </div>
            </Link>
          ))}
        </div>

        {/* Paginação */}
        <div className="flex justify-between items-center mt-16 pt-6 border-t border-dashed border-zinc-300 dark:border-green-900/50 text-xs font-bold uppercase font-mono">
            {currentPage > 1 ? (
                <Link href={`/?page=${currentPage - 1}`} className="hover:text-blue-600 dark:hover:text-green-400 flex items-center gap-1">
                    &lt;&lt; PREV_PAGE
                </Link>
            ) : <span className="opacity-20 text-zinc-400 dark:text-green-900 cursor-not-allowed">&lt;&lt; NULL</span>}
            
            <span className="bg-black text-white dark:bg-green-900 dark:text-green-100 px-3 py-1">
                PAGE_{currentPage}_OF_{totalPages}
            </span>

            {currentPage < totalPages ? (
                <Link href={`/?page=${currentPage + 1}`} className="hover:text-blue-600 dark:hover:text-green-400 flex items-center gap-1">
                    NEXT_PAGE &gt;&gt;
                </Link>
            ) : <span className="opacity-20 text-zinc-400 dark:text-green-900 cursor-not-allowed">NULL &gt;&gt;</span>}
        </div>

      </div>

      <div className="container mx-auto px-4 pb-12">
        <TopicVoting />
      </div>

    </main>
  );
}