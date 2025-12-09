import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0; // Categorias devem ser frescas

interface CategoryProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryProps) {
  const { slug } = await params;
  
  // Decodifica slug (ex: ia -> IA, tech -> Tech)
  // Fazemos uma busca case-insensitive no banco
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .ilike('category', slug) // Busca flexível (Tech = tech)
    .order('created_at', { ascending: false });

  if (!posts) return <div>Loading...</div>;

  const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      
      {/* Header Compacto para Categorias */}
      <header className="border-b border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-950 py-4 sticky top-0 z-20">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/">
                <span className="font-serif font-black text-xl tracking-tighter uppercase">NovaPress.</span>
            </Link>
            <div className="flex gap-4">
                <SearchBar />
                <ThemeToggle />
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-6xl font-serif font-black mb-12 border-b-4 border-blue-600 w-fit pb-2 uppercase text-black dark:text-white">
            {slug === 'ia' ? 'Artificial intelligence' : categoryTitle}
        </h1>

        {posts.length === 0 ? (
            <div className="py-20 text-center">
                <p className="text-2xl font-serif text-gray-400">There is no news in this section yet.</p>
                <Link href="/" className="text-blue-600 underline mt-4 block">Back to home</Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link href={`/post/${post.id}`} key={post.id}>
                        <article className="bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition duration-300 rounded-lg overflow-hidden h-full flex flex-col">
                            <div className="h-48 overflow-hidden bg-gray-200 dark:bg-stone-800 relative">
                                {post.image_url && (
                                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                                )}
                                <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 font-bold">
                                    {format(new Date(post.created_at), 'dd/MM')}
                                </span>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold font-serif mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    {post.title}
                                </h3>
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags?.slice(0,3).map((tag:string) => (
                                        <span key={tag} className="text-xs bg-gray-100 dark:bg-stone-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">#{tag}</span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mt-auto font-serif">
                                    {post.summary}
                                </p>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </main>
  );
}