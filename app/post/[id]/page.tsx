import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostInteractions } from '@/components/PostInteractions';
import { LikeDislike } from '@/components/LikeDislike';
import { Comments } from '@/components/Comments';
import { Header } from '@/components/Header';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ArrowLeft, Hash } from 'lucide-react';
import { logSystemEvent } from '@/app/monitoring/actions';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Busca o Post
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();
  if (!post) notFound();

  // Log de visualização (agora conta para todos)
  await logSystemEvent('view_post', { 
    post_id: id, 
    post_title: post.title,
    category: post.category 
  });

  // 2. Busca Likes, Dislikes e Comentários
  const { count: likeCount } = await supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', id).eq('vote_type', 1);
  const { count: dislikeCount } = await supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', id).eq('vote_type', -1);
  const { data: comments } = await supabase.from('comments').select('*, profiles(username)').eq('post_id', id).order('created_at', { ascending: false });

  // 3. Verifica Usuário (Apenas para saber se está logado e qual foi o voto dele)
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  
  let userVote: "like" | "dislike" | null = null;

  if (user) {
    const { data: voteData } = await supabase
      .from('post_likes')
      .select('vote_type')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single();

    if (voteData) {
      if (voteData.vote_type === 1) userVote = "like";
      if (voteData.vote_type === -1) userVote = "dislike";
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      <Header />

      <div className="container mx-auto px-4 pt-24 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-xs font-mono text-zinc-400 hover:text-black dark:text-green-800 dark:hover:text-green-500 mb-8 transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} className="mr-2" /> Back_To_Feed
        </Link>

        {/* Cabeçalho do Artigo */}
        <header className="mb-12 border-b border-zinc-200 dark:border-green-900/30 pb-12">
            <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-green-800 mb-4">
                <span className="px-2 py-1 bg-zinc-100 dark:bg-green-900/20 text-zinc-600 dark:text-green-600 font-bold rounded">
                    {post.category || 'UNI_BROADCAST'}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight font-mono text-zinc-900 dark:text-zinc-100 tracking-tight">
                {post.title}
            </h1>
        </header>

        {/* Imagem Principal */}
        {post.image_url && (
            <div className="mb-12 rounded-sm overflow-hidden border border-zinc-200 dark:border-green-900/30 relative group">
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay"></div>
                <img src={post.image_url} alt={post.title} className="w-full object-cover max-h-[500px]" />
            </div>
        )}

        {/* --- CONTEÚDO AGORA É LIVRE PARA TODOS --- */}
        <article className="prose dark:prose-invert prose-zinc max-w-none font-mono text-sm md:text-base leading-relaxed text-justify mb-16">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <div className="mt-12 mb-8 text-center text-xs text-zinc-300 dark:text-green-900 uppercase tracking-[0.5em] animate-pulse">
            *** END OF TRANSMISSION ***
        </div>

        {/* Área de Interações (Sempre visível, lógica de login fica dentro dos componentes) */}
        <div className="mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-zinc-100 dark:bg-green-900/10 border border-zinc-200 dark:border-green-900/30 rounded-sm mb-12">
                <div className="flex items-center gap-4">
                    <LikeDislike 
                        postId={post.id} 
                        initialLikes={likeCount || 0} 
                        initialDislikes={dislikeCount || 0}
                        userVote={userVote}
                        isLoggedIn={isLoggedIn} // Passamos o estado de login
                    />
                </div>
                <div className="w-full md:w-auto">
                    <h3 className="font-mono font-bold text-xs uppercase tracking-wide text-zinc-500 dark:text-green-700 mb-2 flex items-center gap-2">
                        <Hash size={12} /> Share_Protocol
                    </h3>
                    <PostInteractions title={post.title} />
                </div>
            </div>

            <Comments 
                postId={post.id} 
                comments={comments || []} 
                isLoggedIn={isLoggedIn} // Passamos o estado de login
            />
        </div>

      </div>
    </main>
  );
}