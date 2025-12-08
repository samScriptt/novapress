"use client";

import { addComment } from "@/app/post/[id]/actions";
import { User } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRef } from "react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string } | null; // Join da tabela profiles
}

interface Props {
  postId: string;
  comments: Comment[];
  isLoggedIn: boolean;
}

export function Comments({ postId, comments, isLoggedIn }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await addComment(formData);
    formRef.current?.reset();
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-serif font-black mb-6">Comentários ({comments.length})</h3>

      {/* Formulário */}
      {isLoggedIn ? (
        <form action={handleSubmit} ref={formRef} className="mb-10 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex-shrink-0" />
          <div className="flex-grow">
            <input type="hidden" name="postId" value={postId} />
            <textarea 
              name="content"
              placeholder="O que você achou desta notícia?"
              className="w-full p-4 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 text-sm"
              required
            />
            <div className="mt-2 flex justify-end">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
              >
                Publicar
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-stone-100 dark:bg-stone-900 p-6 rounded-lg text-center mb-10">
          <p className="text-stone-500 mb-4">Faça login para participar da discussão.</p>
          <Link href="/login" className="text-blue-600 font-bold hover:underline">Entrar agora</Link>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center flex-shrink-0 text-stone-500">
              <User size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  @{comment.profiles?.username || 'Anônimo'}
                </span>
                <span className="text-xs text-stone-400">
                  • {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
            <p className="text-stone-400 italic text-sm">Seja o primeiro a comentar.</p>
        )}
      </div>
    </div>
  );
}