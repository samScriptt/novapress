"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Share2, Twitter, Linkedin, Copy, Check } from "lucide-react"; // Importei Copy e Check

// Ícone do WhatsApp (SVG Inline para garantir compatibilidade se não tiver no lucide)
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 .5-.5l1.4-1.4a.5.5 0 0 0 0-.7l-.7-.7a.5.5 0 0 0-.7 0l-1.4 1.4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5Z" />
        <path d="M14 13.5a1.5 1.5 0 0 1 1.5-1.5h1a.5.5 0 0 1 0 1" />
        <path d="M16 16.5a1.5 1.5 0 0 1-1.5 1.5h-1a.5.5 0 0 1 0-1" />
    </svg>
);

export function PostInteractions({ title }: { title: string }) {
  const [showScroll, setShowScroll] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false); // Estado visual de copiado

  useEffect(() => {
    setShareUrl(window.location.href);

    const checkScroll = () => {
      setShowScroll(window.scrollY > 400);
    };

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const share = (platform: string) => {
    if (!shareUrl) return;

    const text = encodeURIComponent(
      `Check out this article on NovaPress: ${title}`
    );
    const link = encodeURIComponent(shareUrl);

    const URLs: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${link}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${link}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
    };

    const url = URLs[platform];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reseta o ícone após 2s
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <>
      {/* Botões de Compartilhamento Inline */}
      <div className="flex gap-2">
        
        {/* WhatsApp */}
        <button
          onClick={() => share("whatsapp")}
          aria-label="Share on WhatsApp"
          className="p-2 bg-zinc-200 dark:bg-green-900/30 text-zinc-600 dark:text-green-400 rounded-sm hover:bg-[#25D366] hover:text-white dark:hover:bg-[#25D366] dark:hover:text-white transition-colors"
        >
          <WhatsAppIcon />
        </button>

        {/* Twitter */}
        <button
          onClick={() => share("twitter")}
          aria-label="Share on X/Twitter"
          className="p-2 bg-zinc-200 dark:bg-green-900/30 text-zinc-600 dark:text-green-400 rounded-sm hover:bg-black hover:text-white dark:hover:bg-green-800 transition-colors"
        >
          <Twitter size={16} />
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => share("linkedin")}
          aria-label="Share on LinkedIn"
          className="p-2 bg-zinc-200 dark:bg-green-900/30 text-zinc-600 dark:text-green-400 rounded-sm hover:bg-[#0077b5] hover:text-white dark:hover:bg-green-800 transition-colors"
        >
          <Linkedin size={16} />
        </button>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          aria-label="Copy link"
          className="p-2 bg-zinc-200 dark:bg-green-900/30 text-zinc-600 dark:text-green-400 rounded-sm hover:bg-zinc-300 dark:hover:bg-green-800 transition-colors relative"
          title="Copy Link"
        >
          {copied ? <Check size={16} className="text-green-600 dark:text-green-500" /> : <Copy size={16} />}
        </button>
      </div>

      {/* Botão Flutuante de Scroll Top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-8 right-8 p-3 bg-black text-white dark:bg-green-600 dark:text-black shadow-xl transition-all duration-500 z-50 border border-zinc-800 dark:border-green-400 ${
          showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}