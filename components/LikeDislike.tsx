"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toggleVote } from "@/app/post/[id]/actions";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

interface Props {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
  userVote: "like" | "dislike" | null;
  isLoggedIn: boolean;
}

export function LikeDislike({
  postId,
  initialLikes,
  initialDislikes,
  userVote,
  isLoggedIn,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [vote, setVote] = useState<"like" | "dislike" | null>(userVote);

  const handleVote = (type: "like" | "dislike") => {
    if (!isLoggedIn) {
      if (confirm("You must be logged in to vote. Go to login?")) {
        router.push("/login");
      }
      return;
    }

    if (vote === type) {

      if (type === "like") setLikes((n) => n - 1);
      if (type === "dislike") setDislikes((n) => n - 1);
      setVote(null);
    } else {

      if (type === "like") {
        setLikes((n) => n + 1);
        if (vote === "dislike") setDislikes((n) => n - 1);
      } else {
        setDislikes((n) => n + 1);
        if (vote === "like") setLikes((n) => n - 1);
      }
      setVote(type);
    }

    startTransition(async () => {
      await toggleVote(postId, type);
    });
  };

  return (
    <div className="flex items-center gap-4 bg-stone-100 dark:bg-stone-900 w-fit px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800">
      <button
        onClick={() => handleVote("like")}
        disabled={isPending}
        className={`flex items-center gap-2 text-sm font-bold transition hover:scale-110 ${
          vote === "like"
            ? "text-blue-600"
            : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
        }`}
      >
        <ThumbsUp size={18} fill={vote === "like" ? "currentColor" : "none"} />
        <span>{likes}</span>
      </button>

      <div className="w-px h-4 bg-stone-300 dark:bg-stone-700 mx-1"></div>

      <button
        onClick={() => handleVote("dislike")}
        disabled={isPending}
        className={`flex items-center gap-2 text-sm font-bold transition hover:scale-110 ${
          vote === "dislike"
            ? "text-red-500"
            : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
        }`}
      >
        <ThumbsDown
          size={18}
          fill={vote === "dislike" ? "currentColor" : "none"}
        />
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
