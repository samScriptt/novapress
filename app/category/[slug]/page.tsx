import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { Header } from '@/components/Header'; // Usar o Header padrão agora

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
    <main className="min-h-screen bg-zinc-50 dark:bg-black pt-20">
      <Header />

      <div className="container mx-auto px-4 py-8">
        
        {/* Header da Categoria Compacto */}
        <div className="flex items-baseline gap-4 mb-12 border-b border-black dark:border-green-500 pb-4">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black dark:text-green-500">
                {slug}
            </h1>
            <span className="text-xs text-zinc-500 dark:text-green-800 uppercase tracking-widest">
                Directory_List
            </span>
            <span className="ml-auto text-xs font-bold bg-zinc-200 dark:bg-green-900/30 px-2 py-1 rounded">
                {posts?.length || 0} ITEMS
            </span>
        </div>

        {/* Grid (Copiado da Home para consistência) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post) => (
                <Link href={`/post/${post.id}`} key={post.id} className="block bg-white dark:bg-green-900/5 border border-zinc-200 dark:border-green-900 p-4 hover:bg-zinc-50 dark:hover:bg-green-900/10 transition">
                    <div className="text-[10px] text-zinc-400 dark:text-green-700 mb-2">{post.created_at.split('T')[0]}</div>
                    <h3 className="font-bold text-md leading-snug mb-3 text-zinc-900 dark:text-green-100 group-hover:underline">
                        {post.title}
                    </h3>
                    <div className="h-1 w-10 bg-blue-500 dark:bg-green-500"></div>
                </Link>
            ))}
        </div>
      </div>
    </main>
  );
}