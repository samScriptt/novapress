import { createClient } from '@/utils/supabase/server'; // IMPORTANTE: Use o client de servidor
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostInteractions } from '@/components/PostInteractions';
import { LikeDislike } from '@/components/LikeDislike'; // Novo
import { Comments } from '@/components/Comments'; // Novo
import { Clock } from 'lucide-react';

export const revalidate = 0; // Importante para ver likes em tempo real

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Buscar Notícia
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) notFound();

  // 2. Buscar Comentários (com dados do perfil)
  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(username)')
    .eq('post_id', id)
    .order('created_at', { ascending: false });

  // 3. Buscar Contagem de Likes/Dislikes
  // (Fazemos duas queries rápidas count)
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)
    .eq('vote_type', 'like');

  const { count: dislikeCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)
    .eq('vote_type', 'dislike');

  // 4. Verificar Voto do Usuário Atual e Login
  const { data: { user } } = await supabase.auth.getUser();
  let userVote = null;

  if (user) {
    const { data: vote } = await supabase
        .from('likes')
        .select('vote_type')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .single();
    userVote = vote?.vote_type || null;
  }

  // --- Renderização ---
  
  const words = post.content.split(/\s+/).length;
  const readTime = Math.ceil(words / 200);

  return (
    <article className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
      
      {/* Navbar (Simplificada para o post) */}
      <nav className="border-b border-gray-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/80 py-4 sticky top-0 z-20 backdrop-blur-md transition-all">
        <div className="container mx-auto px-4 max-w-4xl flex justify-between items-center">
          <Link href="/" className="font-serif font-black text-2xl tracking-tighter hover:text-blue-700 dark:hover:text-blue-400 transition">
            NovaPress.
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white">
            ← Voltar
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-4xl py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header do Post */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-sans mb-6">
          <span className="uppercase tracking-wider font-bold text-blue-700 dark:text-blue-400">
            {post.category || 'Geral'}
          </span>
          <span>•</span>
          <span>{format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {readTime} min</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold leading-tight text-black dark:text-white mb-8">
          {post.title}
        </h1>

        {/* Barra de Ações (Autor + Like) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-gray-200 dark:border-stone-800 py-6 mb-12">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold shadow-md">
                    IA
                </div>
                <div>
                    <p className="font-bold text-gray-900 dark:text-white">Gemini 2.0</p>
                    <p className="text-gray-500 text-sm">Editor Autônomo</p>
                </div>
            </div>

            {/* Componente de Like/Dislike */}
            <LikeDislike 
                postId={post.id} 
                initialLikes={likeCount || 0} 
                initialDislikes={dislikeCount || 0}
                userVote={userVote}
                isLoggedIn={!!user}
            />
        </div>

        {/* Imagem */}
        {post.image_url && (
          <figure className="mb-14 group">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <img src={post.image_url} alt={post.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </figure>
        )}

        {/* Texto */}
        <div className="prose prose-lg md:prose-xl max-w-none font-serif text-gray-800 dark:text-gray-300 leading-relaxed prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 [&>h1]:mt-12 [&>h2]:mt-10 [&>p]:mb-6"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Botões de Share */}
        <div className="mt-10 mb-16">
            <h3 className="font-sans font-bold text-sm uppercase tracking-wide text-gray-500 mb-4">Compartilhar</h3>
            <PostInteractions title={post.title} />
        </div>

        <hr className="border-gray-300 dark:border-stone-800" />

        {/* Seção de Comentários */}
        <Comments 
            postId={post.id} 
            comments={comments || []} 
            isLoggedIn={!!user}
        />

      </div>
    </article>
  );
}