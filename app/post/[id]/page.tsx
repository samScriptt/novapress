import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostInteractions } from '@/components/PostInteractions';
import { LikeDislike } from '@/components/LikeDislike';
import { Comments } from '@/components/Comments';
import { ContentLock } from '@/components/ContentLock';
import { Typewriter } from '@/components/Typewriter'; 
import { Header } from '@/components/Header';
import { formatDistanceToNow } from 'date-fns';
import { Clock, ArrowLeft, Hash } from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();
  if (!post) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;
  
  let isSubscriber = false;
  let isDailyLimitReached = false;
  let hasAccess = false;

  if (user) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_subscriber, last_free_view_date, last_free_view_post_id')
        .eq('id', user.id)
        .single();
    
    isSubscriber = !!profile?.is_subscriber;

    if (isSubscriber) {
        hasAccess = true;
    } else {
        const today = new Date().toISOString().split('T')[0];
        const lastViewDate = profile?.last_free_view_date;
        const lastViewId = profile?.last_free_view_post_id;

        if (lastViewDate !== today) {
            hasAccess = true;
            await supabase
              .from('profiles')
              .update({ last_free_view_date: today, last_free_view_post_id: id })
              .eq('id', user.id);
        } else {
            if (String(lastViewId) === String(id)) hasAccess = true;
            else {
                hasAccess = false;
                isDailyLimitReached = true;
            }
        }
    }
  } else {
    hasAccess = false;
  }

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

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(username)')
    .eq('post_id', id)
    .order('created_at', { ascending: false });
  
  const words = post.content.split(/\s+/).length;
  const readTime = Math.ceil(words / 200);

  return (
    <article className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-green-400 pt-20 selection:bg-green-500 selection:text-black font-mono">
      <Header />

      <div className="container mx-auto px-4 max-w-3xl py-8">
        
        <div className="mb-8 border-b border-dashed border-zinc-300 dark:border-green-900/50 pb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 dark:text-green-700 hover:text-black dark:hover:text-green-400 mb-6 transition-colors"
            >
                <ArrowLeft size={14} /> Back_to_Feed
            </Link>

            <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-400 dark:text-green-800/80 font-bold mb-4">
                <span className="text-blue-600 dark:text-green-500 bg-blue-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    {post.category || 'DATA_STREAM'}
                </span>
                <span>//</span>
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                <span>//</span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {readTime}MIN_READ
                </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-8 text-black dark:text-green-500">
                <Typewriter text={post.title} speed={20} cursor={false} />
            </h1>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black dark:bg-green-900/30 border border-green-500/50 text-white dark:text-green-400 flex items-center justify-center font-bold text-xs">
                      AI
                    </div>
                    <div className="text-xs uppercase leading-tight">
                        <p className="font-bold text-black dark:text-green-300">Gemini_Unit_2.5</p>
                        <p className="text-zinc-400 dark:text-green-800">Automated_Editor</p>
                    </div>
                </div>
            </div>
        </div>

        {post.image_url && (
            <div className="mb-12 border border-zinc-200 dark:border-green-900/50 p-1 bg-white dark:bg-green-900/5 rounded-sm">
                <div className="aspect-video relative overflow-hidden">
                    <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                          Source_Visual_Data
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="relative group">
            <div 
                className={`
                    prose prose-sm md:prose-lg max-w-none 
                    font-mono text-zinc-800 dark:text-green-300/90 leading-relaxed
                    prose-headings:font-bold prose-headings:uppercase prose-headings:text-black dark:prose-headings:text-green-400
                    prose-a:text-blue-600 dark:prose-a:text-green-500 dark:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:bg-green-900/10 prose-blockquote:text-green-200 prose-blockquote:not-italic prose-blockquote:py-2 prose-blockquote:px-4
                    animate-in fade-in slide-in-from-bottom-8 duration-1000
                    ${!hasAccess ? 'blur-sm select-none pointer-events-none max-h-96 overflow-hidden opacity-50' : ''} 
                `}
                dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            {!hasAccess && (
                <ContentLock 
                    isLoggedIn={isLoggedIn} 
                    isLimitReached={isDailyLimitReached} 
                />
            )}

            {hasAccess && (
                <div className="mt-12 mb-8 text-center text-xs text-zinc-300 dark:text-green-900 uppercase tracking-[0.5em] animate-pulse">
                    *** END OF TRANSMISSION ***
                </div>
            )}
        </div>

        <div className={!hasAccess ? 'hidden' : 'mt-12'}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 bg-zinc-100 dark:bg-green-900/10 border border-zinc-200 dark:border-green-900/30 rounded-sm mb-12">
                <div className="flex items-center gap-4">
                    <LikeDislike 
                        postId={post.id} 
                        initialLikes={likeCount || 0} 
                        initialDislikes={dislikeCount || 0}
                        userVote={userVote}
                        isLoggedIn={true}
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
                isLoggedIn={isLoggedIn}
                isSubscriber={isSubscriber}
            />
        </div>

      </div>
    </article>
  );
}
