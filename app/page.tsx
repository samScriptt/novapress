import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle'; // Importando o botão

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(13);

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-gray-500 dark:text-gray-400 bg-stone-50 dark:bg-stone-950">
        Redação trabalhando... (Rode o Cron)
      </div>
    );
  }

  const [heroPost, ...gridPosts] = posts;

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      
      {/* Header Clássico com Modo Escuro */}
      <header className="border-black py-8 bg-white dark:bg-stone-950 transition-colors duration-300 relative">
        
        {/* Botão de Tema flutuante no canto */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <ThemeToggle />
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
            {format(new Date(), "EEEE, d 'de' MMMM, yyyy", { locale: ptBR })}
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter uppercase mb-6 text-black dark:text-white">
            NovaPress.
          </h1>
          <nav className="flex justify-center gap-6 text-sm font-bold uppercase border-y border-gray-100 dark:border-stone-800 py-3 text-gray-900 dark:text-gray-300">
            <span className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Mundo</span>
            <span className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Tech</span>
            <span className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">IA</span>
            <span className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Mercados</span>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        
        {/* Destaque Principal */}
        {heroPost && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 border-b border-gray-300 dark:border-stone-800 pb-12">
            <div className="lg:col-span-8">
              <div className="aspect-video bg-gray-200 dark:bg-stone-800 overflow-hidden mb-4 rounded-sm">
                {heroPost.image_url && (
                  <img src={heroPost.image_url} alt={heroPost.title} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                )}
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
              <div className="mt-auto text-xs text-gray-400 font-sans uppercase tracking-wider">
                Por Gemini AI • {format(new Date(heroPost.created_at), "HH:mm")}
              </div>
            </div>
          </section>
        )}

        {/* Grid Secundário */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {gridPosts.map((post) => (
            <Link href={`/post/${post.id}`} key={post.id}>
              <article className="group cursor-pointer flex flex-col h-full">
                <div className="aspect-[3/2] bg-gray-100 dark:bg-stone-800 overflow-hidden mb-4 rounded-sm">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">Sem Imagem</div>}
                </div>
                
                {/* Borda lateral adaptativa */}
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
      </div>
    </main>
  );
}