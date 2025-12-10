"use client";

import Link from 'next/link';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/utils/supabase/client';
import { User, LogOut, Terminal, Activity } from 'lucide-react';
import { logout } from '@/app/login/actions';
import { Typewriter } from './Typewriter';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-green-900/50 bg-white/90 dark:bg-black/90 backdrop-blur-sm h-14">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        
        {/* Left Side: Tech Logo + Date */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group text-black dark:text-green-500">
            <Terminal size={18} />
            <div className="font-mono font-bold tracking-tighter text-lg uppercase min-w-[100px]">
              NovaPress
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest border-l border-zinc-300 dark:border-green-900 pl-4 opacity-70 font-mono">
            <Activity size={12} className="text-green-500 animate-pulse" />
            <span>{format(new Date(), "MMM dd, HH:mm", { locale: enUS })}</span>
          </div>
        </div>

        {/* Center: Compact Navigation */}
        <nav className="hidden md:flex gap-6 text-xs font-bold uppercase font-mono text-zinc-500 dark:text-green-800">
          {['Tech', 'World', 'AI', 'Economy', 'Science'].map((item) => (
            <Link
              key={item}
              href={`/category/${item.toLowerCase()}`}
              className="hover:text-black dark:hover:text-green-400 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-3">
          <div className="scale-90">
            <SearchBar />
          </div>
          <div className="scale-90">
            <ThemeToggle />
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 bg-zinc-100 dark:bg-green-900/20 border border-zinc-300 dark:border-green-700 text-black dark:text-green-400 flex items-center justify-center text-xs font-bold font-mono hover:bg-zinc-200 dark:hover:bg-green-900/40 transition"
              >
                {user.email?.charAt(0).toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white dark:bg-black border border-zinc-200 dark:border-green-800 p-1 shadow-xl font-mono z-50">
                  <div className="px-3 py-2 text-[10px] text-zinc-400 dark:text-green-800 border-b border-zinc-100 dark:border-green-900 mb-1 truncate">
                    {user.email}
                  </div>

                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 px-3 py-2 text-xs w-full text-left hover:bg-zinc-100 dark:hover:bg-green-900/30 dark:text-green-400 text-red-600"
                  >
                    <LogOut size={12} /> DISCONNECT_SESSION
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-zinc-500 dark:text-green-600 hover:text-black dark:hover:text-green-400 transition"
            >
              <User size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
