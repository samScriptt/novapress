import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    return <div className="min-h-screen flex items-center justify-center font-serif text-gray-500">Redação trabalhando... (Rode o Cron)</div>;
  }

  const [heroPost, ...gridPosts] = posts;

  return (
    <main className="min-h-screen selection:bg-black selection:text-white">
      {/* Header Clássico */}
      <header className="border-b-4 border-black py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">
            {format(new Date(), "EEEE, d 'de' MMMM, yyyy", { locale: ptBR })}
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter uppercase mb-6">
            NovaPress.
          </h1>
          <nav className="flex justify-center gap-6 text-sm font-bold uppercase border-y border-gray-100 py-3">
            <span className="cursor-pointer hover:underline">Mundo</span>
            <span className="cursor-pointer hover:underline">Tech</span>
            <span className="cursor-pointer hover:underline">IA</span>
            <span className="cursor-pointer hover:underline">Mercados</span>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Destaque Principal */}
        {heroPost && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 border-b border-gray-300 pb-12">
            <div className="lg:col-span-8">
              <div className="aspect-video bg-gray-200 overflow-hidden mb-4">
                {heroPost.image_url && (
                  <img src={heroPost.image_url} alt={heroPost.title} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                )}
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="bg-black text-white text-xs font-bold px-2 py-1 w-fit mb-4 uppercase">Manchete</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4 hover:underline cursor-pointer">
                {heroPost.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed">
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
            <article key={post.id} className="group cursor-pointer">
              <div className="aspect-[3/2] bg-gray-100 overflow-hidden mb-4">
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : <div className="w-full h-full flex items-center justify-center text-gray-300">Sem Imagem</div>}
              </div>
              <div className="border-l-2 border-black pl-4">
                <h3 className="text-xl font-serif font-bold leading-snug mb-2 group-hover:text-blue-700">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}