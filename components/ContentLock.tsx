"use client";

import { Lock, CreditCard, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ContentLockProps {
  isLoggedIn: boolean;
  isLimitReached?: boolean; // Novo prop
}

export function ContentLock({ isLoggedIn, isLimitReached = false }: ContentLockProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Error at payment start.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20 bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent dark:from-stone-950 dark:via-stone-950/95 h-full">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-2xl text-center max-w-md border border-stone-200 dark:border-stone-800 transform translate-y-10">
        
        {/* Ícone muda dependendo do estado */}
        <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
          {isLimitReached ? <Sparkles size={20} /> : <Lock size={20} />}
        </div>

        <h3 className="text-2xl font-serif font-black mb-2 text-stone-900 dark:text-white">
          {isLimitReached ? "Daily Limit Reached" : "Exclusive Content"}
        </h3>
        
        <p className="text-stone-500 mb-6 font-sans text-sm">
          {isLimitReached 
            ? "You've already read your free news article for today. Subscribe to continue reading without limits."
            : "Create a free account to read 1 news article per day or subscribe for unlimited access."
          }
        </p>
        
        <div className="mb-6 flex justify-center items-baseline gap-1">
            <span className="text-3xl font-black text-black dark:text-white">$1</span>
            <span className="text-stone-500">/month</span>
        </div>

        <button 
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? "Processing..." : (
            <>
                <CreditCard size={18} />
                {isLoggedIn ? "Unlock Everything" : "Sign in to subscribe"}
            </>
          )}
        </button>
        
        <p className="mt-4 text-xs text-stone-400">
          Cancel anytime.
        </p>
      </div>
    </div>
  );
}