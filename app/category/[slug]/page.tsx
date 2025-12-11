import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

interface CategoryProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryProps) {
  const { slug } = await params;
  
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .ilike('category', slug)
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black pt-20 pb-12">
      <Header />

      <div className="container mx-auto px-4 py-8">
        
        {/* Header da Categoria Compacto */}
        <div className="flex items-baseline gap-4 mb-12 border-b border-zinc-300 dark:border-green-500 pb-4">
            <h1 className="text-3xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-green-500">
                {slug}
            </h1>
            <span className="text-xs font-mono text-zinc-500 dark:text-green-800 uppercase tracking-widest">
                Directory_List
            </span>
            <span className="ml-auto text-xs font-mono font-bold bg-zinc-200 dark:bg-green-900/30 text-zinc-700 dark:text-green-400 px-2 py-1 rounded">
                {posts?.length || 0} ITEMS
            </span>
        </div>

        {/* Grid com Imagens (Tech Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts?.map((post) => (
                <Link href={`/post/${post.id}`} key={post.id} className="group flex flex-col h-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-green-900/30 hover:border-black dark:hover:border-green-500 transition-colors rounded-sm overflow-hidden">
                    
                    {/* IMAGEM DO POST */}
                    <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border-b border-zinc-100 dark:border-green-900/30">
                        {post.image_url ? (
                            <img 
                                src={post.image_url} 
                                alt="" 
                                className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-green-900">
                                <Zap size={24} />
                            </div>
                        )}
                        
                        {/* Tag Flutuante */}
                        <div className="absolute top-2 left-2">
                            <span className="text-[10px] font-bold font-mono uppercase text-white bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                                {post.category || 'RAW'}
                            </span>
                        </div>
                    </div>

                    {/* CONTEÚDO */}
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold font-mono text-sm leading-snug mb-3 text-zinc-900 dark:text-green-100 group-hover:text-blue-600 dark:group-hover:text-green-400 transition-colors">
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

        {(!posts || posts.length === 0) && (
            <div className="py-20 text-center border border-dashed border-zinc-300 dark:border-green-900 rounded-lg opacity-50">
                <p className="text-xl font-mono uppercase tracking-widest">No Data Found</p>
            </div>
        )}

      </div>
    </main>
  );
}