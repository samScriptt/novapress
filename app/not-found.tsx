import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4">
      <h1 className="text-9xl font-serif font-black mb-4 opacity-10">404</h1>
      <h2 className="text-3xl font-serif font-bold mb-6">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        It seems this news story got lost in the digital press or never existed...
      </p>
      <Link 
        href="/" 
        className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded font-bold hover:opacity-80 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}