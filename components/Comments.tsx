"use client";

import { addComment } from "@/app/post/[id]/actions";
import { User, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string } | null;
}

interface Props {
  postId: string;
  comments: Comment[];
  isLoggedIn: boolean;
  // isSubscriber removido pois não é mais necessário
}

export function Comments({ postId, comments, isLoggedIn }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    if (!isLoggedIn) {
        router.push("/login");
        return;
    }
    
    startTransition(async () => {
      await addComment(formData);
      formRef.current?.reset();
      router.refresh();
    });
  };

  return (
    <div className="border-t border-zinc-200 dark:border-green-900/30 pt-12">
      <h3 className="font-mono text-xl font-bold mb-8 text-zinc-900 dark:text-green-500 uppercase flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 dark:bg-green-500 block"></span>
        Discussion_Log ({comments.length})
      </h3>

      {/* Formulário: Só aparece se estiver logado. Se não, mostra botão de login */}
      <div className="mb-12">
        {isLoggedIn ? (
          <form ref={formRef} action={handleSubmit} className="relative">
            <input type="hidden" name="postId" value={postId} />
            <div className="relative">
                <textarea
                  name="content"
                  required
                  placeholder="Insert your comment..."
                  className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-green-800 p-4 pl-12 rounded-sm focus:outline-none focus:border-blue-600 dark:focus:border-green-500 transition-colors min-h-[100px] font-mono text-sm resize-y"
                />
                <User className="absolute top-4 left-4 text-zinc-400 dark:text-green-800" size={20} />
            </div>
            <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 dark:bg-green-700 text-white px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-blue-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Transmitting...' : 'Send_Comment'}
                </button>
            </div>
          </form>
        ) : (
          <div className="bg-zinc-100 dark:bg-green-900/10 border border-dashed border-zinc-300 dark:border-green-900 p-8 text-center rounded-sm">
            <Lock className="mx-auto mb-4 text-zinc-400 dark:text-green-700" size={24} />
            <p className="font-mono text-sm text-zinc-600 dark:text-green-400 mb-6">
                Authentication required to participate in this thread.
            </p>
            <Link 
                href="/login" 
                className="inline-block bg-black text-white dark:bg-green-600 dark:text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
                Login_To_Comment
            </Link>
          </div>
        )}
      </div>

      {/* Lista de Comentários (Visível para todos) */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-10 h-10 rounded-sm bg-zinc-200 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0 text-zinc-500 dark:text-green-700 font-bold uppercase font-mono border border-zinc-300 dark:border-green-900/50">
              {comment.profiles?.username?.charAt(0) || "?"}
            </div>

            <div className="flex-grow bg-zinc-50 dark:bg-black p-4 border-l-2 border-zinc-200 dark:border-green-900 group-hover:border-blue-500 dark:group-hover:border-green-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs font-mono text-zinc-900 dark:text-green-400">
                    @{comment.profiles?.username || "Unknown_User"}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-green-800 uppercase">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                      locale: enUS,
                    })}
                  </span>
                </div>
              </div>

              <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed font-mono">
                {comment.content}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <p className="font-mono italic text-zinc-400 dark:text-green-900 text-xs">
              // NO_DATA_FOUND: BE_THE_FIRST_TO_COMMENT
            </p>
          </div>
        )}
      </div>
    </div>
  );
}