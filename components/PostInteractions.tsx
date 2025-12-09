"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Share2, Twitter, Linkedin, MessageCircle } from "lucide-react";

export function PostInteractions({ title }: { title: string }) {
  const [showScroll, setShowScroll] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Define URL ao montar (evita erro no SSR)
    setShareUrl(window.location.href);

    const checkScroll = () => {
      setShowScroll(window.scrollY > 400);
    };

    window.addEventListener("scroll", checkScroll);

    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const share = (platform: string) => {
    if (!shareUrl) return;

    const text = encodeURIComponent(`Confira esta notícia no NovaPress: ${title}`);
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
      alert("Link copiado!");
    } catch {
      // fallback se o navegador bloquear clipboard API
      prompt("Copie o link manualmente:", shareUrl);
    }
  };

  return (
    <>
      {/* Botões de compartilhar */}
      <div className="flex gap-4 my-8">
        <button
          onClick={() => share("whatsapp")}
          aria-label="Compartilhar no WhatsApp"
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition hover:scale-110"
        >
          <MessageCircle size={20} />
        </button>

        <button
          onClick={() => share("twitter")}
          aria-label="Compartilhar no X/Twitter"
          className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-80 transition hover:scale-110"
        >
          <Twitter size={20} />
        </button>

        <button
          onClick={() => share("linkedin")}
          aria-label="Compartilhar no LinkedIn"
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition hover:scale-110"
        >
          <Linkedin size={20} />
        </button>

        <button
          onClick={copyLink}
          aria-label="Copiar link"
          className="p-3 bg-gray-200 text-gray-700 dark:bg-stone-800 dark:text-gray-200 rounded-full hover:bg-gray-300 transition hover:scale-110"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Botão "voltar ao topo" */}
      <button
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
        className={`fixed bottom-8 right-8 p-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-xl transition-all duration-500 z-50
          ${showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        `}
      >
        <ArrowUp size={24} />
      </button>
    </>
  );
}
