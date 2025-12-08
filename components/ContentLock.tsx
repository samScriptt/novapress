import Link from "next/link";
import { Lock } from "lucide-react";

export function ContentLock() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20 bg-gradient-to-t from-stone-50 via-stone-50/90 to-transparent dark:from-stone-950 dark:via-stone-950/90 h-full">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-2xl text-center max-w-md border border-stone-200 dark:border-stone-800 transform translate-y-10">
        <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={20} />
        </div>
        <h3 className="text-2xl font-serif font-black mb-2 text-stone-900 dark:text-white">
          Continue lendo
        </h3>
        <p className="text-stone-500 mb-6 font-sans text-sm">
          Crie uma conta gratuita para desbloquear esta notícia, comentar e curtir.
        </p>
        <Link 
          href="/login" 
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Entrar ou Cadastrar
        </Link>
        <p className="mt-4 text-xs text-stone-400">
          Já tem conta? <Link href="/login" className="underline hover:text-blue-500">Faça login</Link>
        </p>
      </div>
    </div>
  );
}