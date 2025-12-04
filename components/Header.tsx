"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";

const cx = (...c: (string | boolean | undefined)[]) =>
  c.filter(Boolean).join(" ");

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
    const handleScroll = () => {
        // ✅ Só existe UM estado permitido:
        // Topo absoluto = false
        // Qualquer outro lugar = true
        if (window.scrollY === 0) {
        setIsScrolled(false);
        } else {
        setIsScrolled(true);
        }
    };

    // ✅ Dispara uma vez na montagem (caso a página já comece scrollada)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  return (
    <header
      className={cx(
        "sticky top-0 z-30 border-black dark:border-stone-100 bg-white dark:bg-stone-950 shadow-sm transition-[padding] duration-500",
        isScrolled ? "py-3" : "py-8"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">

          {/* DATA */}
          <div
            className={cx(
              "text-xs font-bold tracking-widest uppercase text-gray-500 transition-opacity duration-300 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2",
              isScrolled ? "opacity-0 pointer-events-none hidden md:block" : "opacity-100"
            )}
          >
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </div>

          {/* LOGO */}
          <div className="text-center flex-grow transition-[font-size] duration-300
 duration-500">
            <Link href="/">
              <h1
                className={cx(
                  "font-serif font-black tracking-tighter uppercase text-black dark:text-white transition-[font-size] duration-500",
                  isScrolled ? "text-4xl" : "text-5xl md:text-8xl"
                )}
              >
                NovaPress.
              </h1>
            </Link>
          </div>

          {/* CONTROLES */}
          <div
            className={cx(
              "flex items-center gap-4 transition-transform duration-300 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2",
              isScrolled ? "scale-90 origin-right" : "scale-100"
            )}
          >
            <SearchBar />
            <ThemeToggle />
          </div>
        </div>

        {/* NAVEGAÇÃO */}
        <nav
          className={cx(
            "flex flex-wrap justify-center gap-6 text-sm font-bold uppercase border-t border-gray-100 dark:border-stone-800 text-gray-900 dark:text-gray-300 transition-[padding] duration-300 duration-500 overflow-hidden",
            isScrolled
              ? "max-h-0 opacity-0 mt-0 pt-0"
              : "max-h-20 opacity-100 mt-4 pt-4"
          )}
        >
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
