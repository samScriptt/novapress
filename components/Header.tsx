"use client";

import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { User, LogOut, Menu } from 'lucide-react';
import { logout } from '@/app/login/actions';

// Utilitário simples para classes
const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export function Header() {
  const [showFloating, setShowFloating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 1. Auth e Scroll Listener
  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const handleScroll = () => {
      // Se rolar mais de 400px (garante que a header principal sumiu), mostra a flutuante
      const shouldShow = window.scrollY > 400;
      setShowFloating(shouldShow);
      
      // Fecha o menu de usuário se estiver aberto ao trocar de header
      if (shouldShow !== showFloating) setMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showFloating]); // Dependência adicionada para fechar menu corretamente

  // Componente interno para os Controles (para não duplicar código visual)
  const UserControls = ({ isFloating = false }) => (
    <div className="flex items-center gap-3">
      <SearchBar />
      <ThemeToggle />
      
      {user ? (
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className={cx(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold hover:opacity-80 transition shadow-sm",
                isFloating ? "bg-stone-100 dark:bg-stone-800 text-black dark:text-white" : "bg-black dark:bg-white text-white dark:text-black"
              )}
            >
                {user.email?.charAt(0).toUpperCase()}
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 dark:border-stone-800 mb-1 truncate">
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
  );

  return (
    <>
      {/* =========================================================
          1. HEADER PRINCIPAL (Normal, rola com a página)
      ========================================================= */}
      <header className="bg-white dark:bg-stone-950 border-b border-black/10 dark:border-white/10 py-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
              
              {/* Data */}
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="text-xs font-bold tracking-widest uppercase text-gray-500">
                    {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </div>
              </div>

              {/* Logo Grande */}
              <div className="text-center flex-grow">
                  <Link href="/">
                      <h1 className="font-serif font-black tracking-tighter uppercase text-5xl md:text-8xl text-black dark:text-white hover:opacity-90 transition-opacity">
                          NovaPress.
                      </h1>
                  </Link>
              </div>

              {/* Controles Principais */}
              <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                {!showFloating && <UserControls />} 
                {/* Ocultamos visualmente os controles aqui quando a flutuante aparece para evitar ID clashes ou tabulação estranha, opcional */}
              </div>
          </div>

          {/* Navegação Completa */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase border-t border-gray-100 dark:border-stone-800 text-gray-900 dark:text-gray-300 mt-6 pt-6">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
              <Link href="/category/tech" className="hover:text-blue-600 dark:hover:text-blue-400">Tech</Link>
              <Link href="/category/mundo" className="hover:text-blue-600 dark:hover:text-blue-400">Mundo</Link>
              <Link href="/category/ia" className="hover:text-blue-600 dark:hover:text-blue-400">IA</Link>
              <Link href="/category/economia" className="hover:text-blue-600 dark:hover:text-blue-400">Economia</Link>
          </nav>
        </div>
      </header>

      {/* =========================================================
          2. HEADER FLUTUANTE (Compacta, surge ao rolar)
      ========================================================= */}
      <div 
        className={cx(
          "fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-gray-200 dark:border-stone-800 shadow-lg transition-transform duration-500 ease-in-out",
          showFloating ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Compacto */}
            <Link href="/" className="group flex items-center gap-2">
                <span className="font-serif font-black text-2xl tracking-tighter uppercase text-black dark:text-white group-hover:opacity-80">
                    NP.
                </span>
                <span className="hidden sm:inline-block font-serif font-bold text-lg tracking-tight text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition">
                  NovaPress
                </span>
            </Link>

            {/* Controles Compactos */}
            <UserControls isFloating={true} />
        </div>
      </div>
    </>
  );
}