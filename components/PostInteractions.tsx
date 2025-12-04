"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Share2, Twitter, Linkedin, MessageCircle } from "lucide-react";

export function PostInteractions({ title }: { title: string }) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const share = (platform: string) => {
    let url = "";
    const text = encodeURIComponent(`Confira esta notícia no NovaPress: ${title}`);
    const link = encodeURIComponent(shareUrl);

    if (platform === "whatsapp") url = `https://wa.me/?text=${text}%20${link}`;
    if (platform === "twitter") url = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
    if (platform === "linkedin") url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;

    window.open(url, "_blank");
  };

  return (
    <>
      {/* Botões de Share Fixos ou no final */}
      <div className="flex gap-4 my-8">
        <button onClick={() => share("whatsapp")} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition hover:scale-110">
          <MessageCircle size={20} />
        </button>
        <button onClick={() => share("twitter")} className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-80 transition hover:scale-110">
          <Twitter size={20} />
        </button>
        <button onClick={() => share("linkedin")} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition hover:scale-110">
          <Linkedin size={20} />
        </button>
        <button 
          onClick={() => { navigator.clipboard.writeText(shareUrl); alert("Link copiado!"); }} 
          className="p-3 bg-gray-200 text-gray-700 dark:bg-stone-800 dark:text-gray-200 rounded-full hover:bg-gray-300 transition hover:scale-110"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Botão Voltar ao Topo */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-xl transition-all duration-500 z-50 ${
          showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp size={24} />
      </button>
    </>
  );
}