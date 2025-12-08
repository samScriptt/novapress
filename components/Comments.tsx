"use client";

import { addComment } from "@/app/post/[id]/actions";
import { User, SendHorizontal } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation"; // 1. Importar useRouter

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
}

export function Comments({ postId, comments, isLoggedIn }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter(); // 2. Inicializar router
  const [isPending, startTransition] = useTransition(); // 3. Usar transition para loading suave

  const handleSubmit = async (formData: FormData) => {
    // Envolvemos na transição para o Next.js saber que estamos mudando estado
    startTransition(async () => {
        await addComment(formData);
        formRef.current?.reset();
        router.refresh(); // 4. Força a atualização da tela
    });
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-serif font-black mb-6">Comentários ({comments.length})</h3>

      {/* Formulário */}
      {isLoggedIn ? (
        <form action={handleSubmit} ref={formRef} className="mb-10 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex-shrink-0 flex items-center justify-center text-white dark:text-black font-bold text-xs">
             EU
          </div>
          <div className="flex-grow relative">
            <input type="hidden" name="postId" value={postId} />
            <textarea 
              name="content"
              placeholder="Participe da discussão..."
              className="w-full p-4 pr-12 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-28 text-sm disabled:opacity-50"
              required
              disabled={isPending} // Desabilita enquanto envia
            />
            <button 
              type="submit" 
              disabled={isPending}
              className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:bg-stone-400"
              title="Enviar Comentário"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SendHorizontal size={18} />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-stone-100 dark:bg-stone-900 p-8 rounded-xl text-center mb-10 border border-dashed border-stone-300 dark:border-stone-800">
          <p className="text-stone-500 mb-4 font-serif italic">Quer deixar sua opinião?</p>
          <Link href="/login" className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-bold text-sm hover:opacity-80 transition">
            Faça Login para Comentar
          </Link>
        </div>
      )}

      {/* Lista com Animação simples */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center flex-shrink-0 text-stone-500 font-bold uppercase">
              {comment.profiles?.username?.charAt(0) || '?'}
            </div>
            <div className="flex-grow bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl rounded-tl-none border border-stone-100 dark:border-stone-800/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    @{comment.profiles?.username || 'Anônimo'}
                    </span>
                    <span className="text-[10px] text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                </div>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed font-serif">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
            <div className="text-center py-10 opacity-50">
                <p className="font-serif italic text-stone-400">Nenhum comentário ainda. Seja o primeiro!</p>
            </div>
        )}
      </div>
    </div>
  );
}