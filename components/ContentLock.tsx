"use client";

import { Lock, CreditCard, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ContentLockProps {
  isLoggedIn: boolean;
  isLimitReached?: boolean;
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
      alert("System Error: Payment gateway unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20 bg-gradient-to-t from-zinc-50 via-zinc-50/95 to-transparent dark:from-black dark:via-black/95 h-full">
      <div className="bg-white dark:bg-[#0a0a0a] p-8 max-w-md w-full border border-zinc-200 dark:border-green-900 shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(21,128,61,0.1)] transform translate-y-10 text-center font-mono">
        
        <div className="w-16 h-16 bg-black dark:bg-green-900/20 text-white dark:text-green-500 rounded-sm flex items-center justify-center mx-auto mb-6 border border-transparent dark:border-green-700">
          {isLimitReached ? <Sparkles size={24} /> : <Lock size={24} />}
        </div>

        <h3 className="text-xl font-bold uppercase tracking-widest mb-4 text-black dark:text-green-400">
          {isLimitReached ? "DAILY_LIMIT_REACHED" : "ENCRYPTED_CONTENT"}
        </h3>
        
        <p className="text-zinc-500 dark:text-green-800/80 mb-8 text-xs leading-relaxed">
          {isLimitReached 
            ? "Free tier bandwidth exceeded. Upgrade to Premium Node for unlimited data stream access."
            : "Secure content detected. Authenticate or upgrade clearance level to decrypt full data."
          }
        </p>
        
        <div className="mb-8 flex justify-center items-baseline gap-1 border-y border-zinc-100 dark:border-green-900/30 py-4">
            <span className="text-4xl font-black text-black dark:text-white">$1</span>
            <span className="text-zinc-400 dark:text-green-700 text-xs uppercase">/month</span>
        </div>

        <button 
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-green-600 dark:hover:bg-green-500 text-white dark:text-black font-bold py-3 uppercase tracking-widest transition-all hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? "PROCESSING..." : (
            <>
                <CreditCard size={16} />
                {isLoggedIn ? "UNLOCK_ACCESS" : "LOGIN_TO_SUBSCRIBE"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}