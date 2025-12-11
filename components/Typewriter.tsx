"use client";
import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
}

export function Typewriter({ text, speed = 30, className, cursor = true }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Reseta sempre que o texto mudar
    setDisplayedText(""); 
    
    const timer = setInterval(() => {
      setDisplayedText((prev) => {
        // Se já escreveu tudo, limpa o intervalo
        if (prev.length >= text.length) {
          clearInterval(timer);
          return prev;
        }
        // Pega do início até o próximo caractere (prev.length + 1)
        // Isso é mais seguro que somar charAt(i) pois se baseia no estado atual
        return text.slice(0, prev.length + 1);
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={`${className} ${cursor ? 'cursor-blink' : ''}`}>
      {displayedText}
    </span>
  );
}