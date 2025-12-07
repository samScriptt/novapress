"use client";

import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client'; // Cliente Browser
import { User, LogOut } from 'lucide-react';
import { logout } from '@/app/login/actions'; // Importa a action de logout

// Utilitário simples para classes
const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null); // Estado para o usuário
  const [menuOpen, setMenuOpen] = useState(false);

  // 1. Verificar Login ao montar
  useEffect(() => {
    const supabase = createClient();
    
    // Pega o usuário atual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Scroll Logic (Histerese)
    const handleScroll = () => {
      if (window.scrollY > 60) setIsScrolled(true);
      else if (window.scrollY < 30) setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cx(
        "border-b-4 border-black dark:border-stone-100 bg-white dark:bg-stone-950 sticky top-0 z-30 transition-all duration-500 ease-in-out shadow-sm",
        isScrolled ? "py-3" : "py-8" 
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            
            {/* Data */}
            <div className={cx(
                "text-xs font-bold tracking-widest uppercase text-gray-500 transition-opacity duration-300 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2",
                isScrolled ? "opacity-0 pointer-events-none hidden md:block" : "opacity-100"
            )}>
                {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </div>

            {/* Logo Central */}
            <div className="text-center flex-grow transition-all duration-500">
                <Link href="/">
                    <h1 className={cx(
                        "font-serif font-black tracking-tighter uppercase text-black dark:text-white hover:opacity-90 transition-all duration-500",
                        isScrolled ? "text-4xl" : "text-5xl md:text-8xl"
                    )}>
                        NovaPress.
                    </h1>
                </Link>
            </div>

            {/* Controles (Barra, Tema e LOGIN) */}
            <div className={cx(
                "flex items-center gap-3 transition-all duration-300 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2",
                isScrolled ? "scale-90 origin-right" : "scale-100"
            )}>
                <SearchBar />
                <ThemeToggle />
                
                {/* Botão de Usuário */}
                {user ? (
                   <div className="relative">
                      <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold hover:opacity-80 transition"
                      >
                         {/* Mostra a inicial do email se não tiver username carregado ainda */}
                         {user.email?.charAt(0).toUpperCase()}
                      </button>
                      
                      {/* Dropdown Menu Simples */}
                      {menuOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded shadow-xl p-2 flex flex-col gap-1">
                            <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 dark:border-stone-800 mb-1">
                                {user.email}
                            </div>
                            <button 
                                onClick={() => logout()} 
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded w-full text-left"
                            >
                                <LogOut size={14} /> Sair
                            </button>
                        </div>
                      )}
                   </div>
                ) : (
                    <Link 
                        href="/login"
                        className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition"
                        title="Entrar"
                    >
                        <User size={20} />
                    </Link>
                )}
            </div>
        </div>

        {/* Navegação */}
        <nav className={cx(
            "flex flex-wrap justify-center gap-6 text-sm font-bold uppercase border-t border-gray-100 dark:border-stone-800 text-gray-900 dark:text-gray-300 transition-all duration-500 overflow-hidden",
            isScrolled ? "max-h-0 opacity-0 mt-0 pt-0" : "max-h-20 opacity-100 mt-4 pt-4"
        )}>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <Link href="/category/tech" className="hover:text-blue-600 dark:hover:text-blue-400">Tech</Link>
            <Link href="/category/mundo" className="hover:text-blue-600 dark:hover:text-blue-400">Mundo</Link>
            <Link href="/category/ia" className="hover:text-blue-600 dark:hover:text-blue-400">IA</Link>
            <Link href="/category/economia" className="hover:text-blue-600 dark:hover:text-blue-400">Economia</Link>
        </nav>
      </div>
    </header>
  );
}