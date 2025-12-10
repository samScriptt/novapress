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
    setDisplayedText(""); 
    let i = 0;
    
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={`${className} ${cursor ? 'cursor-blink' : ''}`}>
      {displayedText}
    </span>
  );
}