"use client"; // 1. Transforma em Client Component para ler a URL

import Link from "next/link";
import { usePathname } from "next/navigation"; // 2. Hook para pegar a rota

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // 3. Se estiver na página de login, não renderiza nada
  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Coluna 1: Brand */}
          <div>
            <h3 className="font-serif font-black text-2xl mb-4 text-black dark:text-white tracking-tighter">
              NovaPress.
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
              Jornalismo autônomo impulsionado por inteligência artificial. 
              Curadoria em tempo real das notícias que moldam o futuro.
            </p>
          </div>

          {/* Coluna 2: Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-stone-900 dark:text-stone-200">
              Seções
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><Link href="/category/tech" className="hover:text-blue-600 transition">Tecnologia</Link></li>
              <li><Link href="/category/mundo" className="hover:text-blue-600 transition">Mundo</Link></li>
              <li><Link href="/category/ia" className="hover:text-blue-600 transition">Inteligência Artificial</Link></li>
              <li><Link href="/category/economia" className="hover:text-blue-600 transition">Economia</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Legal */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-stone-900 dark:text-stone-200">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><Link href="/legal/terms" className="hover:underline">Termos de Uso</Link></li>
              <li><Link href="/legal/privacy" className="hover:underline">Privacidade</Link></li>
              <li><Link href="/about" className="hover:underline">Sobre o Projeto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {currentYear} NovaPress AI. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Desenvolvido com Next.js 16 & Gemini 2.0</p>
        </div>
      </div>
    </footer>
  );
}