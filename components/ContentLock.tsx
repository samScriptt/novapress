"use client";

import { Lock, CreditCard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContentLock({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // Chama nossa API para gerar o link de pagamento
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redireciona para o Stripe
      }
    } catch (error) {
      alert("Error when starting payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-20 bg-gradient-to-t from-stone-50 via-stone-50/95 to-transparent dark:from-stone-950 dark:via-stone-950/95 h-full">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-2xl text-center max-w-md border border-stone-200 dark:border-stone-800 transform translate-y-10">
        <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={20} />
        </div>
        <h3 className="text-2xl font-serif font-black mb-2 text-stone-900 dark:text-white">
          Exclusive Access
        </h3>
        <p className="text-stone-500 mb-6 font-sans text-sm">
            Independent journalism is expensive. Support NovaPress and get unlimited access to all the news.
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
                {isLoggedIn ? "Sign Up Now" : "Log In to Sign Up"}
            </>
          )}
        </button>
        
        <p className="mt-4 text-xs text-stone-400">
            Cancel anytime. Secure payment via Stripe.
        </p>
      </div>
    </div>
  );
}