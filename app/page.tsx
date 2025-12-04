import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar'; // Importe a barra

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0; // Para busca funcionar em tempo real, removemos cache estático da home

// Interface para receber parâmetros de busca via URL
interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q;

  // Query base
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  // Se tiver busca, filtra (Case insensitive no titulo ou resumo)
  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%`);
  } else {
    query = query.limit(13); // Limite padrão só se não for busca
  }

  const { data: posts } = await query;
  
  // Se for busca, não mostramos Hero Section, apenas Grid
  const showHero = !searchQuery && posts && posts.length > 0;
  const heroPost = showHero ? posts![0] : null;
  const gridPosts = showHero ? posts!.slice(1) : (posts || []);

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      
      <header className="border-black dark:border-stone-100 py-8 bg-white dark:bg-stone-950 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
            {/* Top Bar: Data e Controles */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="text-xs font-bold tracking-widest uppercase text-gray-500">
                    {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <SearchBar />
                    <ThemeToggle />
                </div>
            </div>

            {/* Logo */}
            <div className="text-center mb-6">
                <Link href="/">
                    <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tighter uppercase text-black dark:text-white hover:opacity-90 transition">
                        NovaPress.
                    </h1>
                </Link>
            </div>

            {/* Navegação por Categorias (Links Reais) */}
            <nav className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase border-t border-gray-100 dark:border-stone-800 pt-4 text-gray-900 dark:text-gray-300">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
                <Link href="/category/tech" className="hover:text-blue-600 dark:hover:text-blue-400">Tech</Link>
                <Link href="/category/mundo" className="hover:text-blue-600 dark:hover:text-blue-400">Mundo</Link>
                <Link href="/category/ia" className="hover:text-blue-600 dark:hover:text-blue-400">IA</Link>
                <Link href="/category/economia" className="hover:text-blue-600 dark:hover:text-blue-400">Economia</Link>
            </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        
        {/* Aviso de Resultados da Busca */}
        {searchQuery && (
             <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                <h2 className="text-xl font-serif font-bold">
                    Resultados para: "{searchQuery}"
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {posts?.length} notícias encontradas.
                </p>
             </div>
        )}

        {/* Hero Section (Apenas se não for busca) */}
        {heroPost && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 border-b border-gray-300 dark:border-stone-800 pb-12">
             {/* ... (Mantenha o código do Hero anterior aqui) ... */}
              <div className="lg:col-span-8">
              <div className="aspect-video bg-gray-200 dark:bg-stone-800 overflow-hidden mb-4 rounded-sm relative group">
                <Link href={`/post/${heroPost.id}`}>
                    {heroPost.image_url && (
                    <img src={heroPost.image_url} alt={heroPost.title} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                    )}
                    {/* Badge da Categoria no Hero */}
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase shadow-md">
                        {heroPost.category || 'Geral'}
                    </span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-2 py-1 w-fit mb-4 uppercase">Manchete</span>
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
                  {post.image_url && (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  )}
                   {/* Badge Categoria Grid */}
                   <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 uppercase">
                        {post.category || 'News'}
                    </span>
                </div>
                <div className="border-l-2 border-black dark:border-stone-600 pl-4 flex-grow group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors">
                  <h3 className="text-xl font-serif font-bold leading-snug mb-2 text-black dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                    {post.title}
                  </h3>
                   {/* Tags */}
                   {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {post.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[10px] text-gray-500 uppercase tracking-wide">#{tag}</span>
                        ))}
                      </div>
                   )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed font-serif">
                    {post.summary}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        {(!posts || posts.length === 0) && (
            <div className="text-center py-20 opacity-50 font-serif">Nenhuma notícia encontrada.</div>
        )}

      </div>
    </main>
  );
}