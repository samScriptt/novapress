import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4">
      <h1 className="text-9xl font-serif font-black mb-4 opacity-10">404</h1>
      <h2 className="text-3xl font-serif font-bold mb-6">Página não encontrada</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        Parece que esta notícia se perdeu nas prensas digitais ou nunca existiu.
      </p>
      <Link 
        href="/" 
        className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded font-bold hover:opacity-80 transition"
      >
        Voltar para a Home
      </Link>
    </div>
  );
}