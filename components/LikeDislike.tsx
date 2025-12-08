"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toggleVote } from "@/app/post/[id]/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
  userVote: 'like' | 'dislike' | null; // O que o usuário atual votou
  isLoggedIn: boolean;
}

export function LikeDislike({ postId, initialLikes, initialDislikes, userVote, isLoggedIn }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleVote = (type: 'like' | 'dislike') => {
    if (!isLoggedIn) {
      if (confirm("Você precisa estar logado para votar. Ir para login?")) {
        router.push("/login");
      }
      return;
    }

    startTransition(async () => {
      await toggleVote(postId, type);
    });
  };

  return (
    <div className="flex items-center gap-4 bg-stone-100 dark:bg-stone-900 w-fit px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800">
      <button 
        onClick={() => handleVote('like')}
        disabled={isPending}
        className={`flex items-center gap-2 text-sm font-bold transition hover:scale-110 ${userVote === 'like' ? 'text-blue-600' : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'}`}
      >
        <ThumbsUp size={18} fill={userVote === 'like' ? "currentColor" : "none"} />
        <span>{initialLikes}</span>
      </button>

      <div className="w-px h-4 bg-stone-300 dark:bg-stone-700 mx-1"></div>

      <button 
        onClick={() => handleVote('dislike')}
        disabled={isPending}
        className={`flex items-center gap-2 text-sm font-bold transition hover:scale-110 ${userVote === 'dislike' ? 'text-red-500' : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'}`}
      >
        <ThumbsDown size={18} fill={userVote === 'dislike' ? "currentColor" : "none"} />
        <span>{initialDislikes}</span>
      </button>
    </div>
  );
}