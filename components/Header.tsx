"use client";

import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { User, LogOut } from 'lucide-react';
import { logout } from '@/app/login/actions';

// Utilitário simples para classes
const cx = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export function Header() {
  const [showFloating, setShowFloating] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // MUDANÇA 1: Estado agora guarda o ID do menu aberto (string) ou null
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // 1. Auth e Scroll Listener
  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      setShowFloating(shouldShow);
      
      // MUDANÇA 2: Fecha qualquer menu aberto ao rolar a página
      if (activeMenu) setActiveMenu(null); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMenu]); // Adicionei activeMenu nas dependências

  // Componente interno atualizado para aceitar um ID único
  const UserControls = ({ isFloating = false, menuId }: { isFloating?: boolean, menuId: string }) => {
    // Verifica se ESTE menu específico é o que está ativo
    const isOpen = activeMenu === menuId;

    const toggleMenu = () => {
        // Se já estiver aberto, fecha (null). Se não, abre este ID.
        setActiveMenu(isOpen ? null : menuId);
    };

    return (
        <div className="flex items-center gap-3">
          <SearchBar />
          <ThemeToggle />
          
          {user ? (
              <div className="relative">
                <button 
                  onClick={toggleMenu}
                  className={cx(
                    "w-9 h-9 rounded-full flex items-center justify-center font-bold hover:opacity-80 transition shadow-sm",
                    isFloating ? "bg-stone-100 dark:bg-stone-800 text-black dark:text-white" : "bg-black dark:bg-white text-white dark:text-black"
                  )}
                >
                    {user.email?.charAt(0).toUpperCase()}
                </button>
                
                {/* Renderiza o menu apenas se isOpen for verdadeiro para ESTE componente */}
                {isOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 rounded shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 dark:border-stone-800 mb-1 truncate">
                          {user.email}
                      </div>
                      <button 
                          onClick={() => logout()} 
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded w-full text-left"
                      >
                          <LogOut size={14} /> Exit
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
  };

  return (
    <>
      {/* =========================================================
          1. HEADER PRINCIPAL
      ========================================================= */}
      <header className="bg-white dark:bg-stone-950 border-b border-black/10 dark:border-white/10 py-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
              
              {/* Data */}
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="text-xs font-bold tracking-widest uppercase text-gray-500">
                    {format(new Date(), "EEEE, MMMM d, yyyy", { locale: enUS })}
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

              {/* Controles Principais - ID = "main" */}
              <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                <UserControls menuId="main" /> 
              </div>
          </div>

          {/* Navegação */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase border-t border-gray-100 dark:border-stone-800 text-gray-900 dark:text-gray-300 transition-all duration-500 overflow-hidden">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            
            {/* CORREÇÃO: technology -> tech */}
            <Link href="/category/tech" className="hover:text-blue-600 dark:hover:text-blue-400">Tech</Link>
            
            <Link href="/category/world" className="hover:text-blue-600 dark:hover:text-blue-400">World</Link>
            <Link href="/category/ai" className="hover:text-blue-600 dark:hover:text-blue-400">AI</Link>
            
            {/* CORREÇÃO: business -> economy (Pois a IA gera 'Economy') */}
            <Link href="/category/economy" className="hover:text-blue-600 dark:hover:text-blue-400">Economy</Link>
            
            <Link href="/category/science" className="hover:text-blue-600 dark:hover:text-blue-400">Science</Link>
        </nav>
        </div>
      </header>

      {/* =========================================================
          2. HEADER FLUTUANTE
      ========================================================= */}
      <div 
        className={cx(
          "fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-gray-200 dark:border-stone-800 shadow-lg transition-transform duration-500 ease-in-out",
          showFloating ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2">
                <span className="font-serif font-black text-2xl tracking-tighter uppercase text-black dark:text-white group-hover:opacity-80">
                    NP.
                </span>
                <span className="hidden sm:inline-block font-serif font-bold text-lg tracking-tight text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition">
                  NovaPress
                </span>
            </Link>

            {/* Controles Flutuantes - ID = "floating" */}
            <UserControls isFloating={true} menuId="floating" />
        </div>
      </div>
    </> 
  );
}