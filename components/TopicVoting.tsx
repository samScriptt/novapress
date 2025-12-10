"use client";

import { useState, useEffect } from "react";
import { submitFeedback, checkUserFeedbackStatus } from "@/app/monitoring/actions";
import { Star, Send, Lock, CalendarCheck } from "lucide-react"; // CalendarCheck novo
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const TOPICS = ["Tech", "World", "AI", "Economy", "Science"];

export function TopicVoting() {
  const [status, setStatus] = useState<'loading' | 'can_vote' | 'limit_reached' | 'guest'>('loading');
  const [nextDate, setNextDate] = useState<string | null>(null);
  
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // 1. Verifica status ao carregar (O Pulo do Gato para o F5)
  useEffect(() => {
    async function init() {
      const result = await checkUserFeedbackStatus();
      
      if (result.canVote) {
        setStatus('can_vote');
      } else {
        setStatus(result.reason as 'guest' | 'limit_reached');
        if (result.nextDate) setNextDate(result.nextDate);
      }
    }
    init();
  }, []); // Roda apenas uma vez no mount

  async function clientSubmit(formData: FormData) {
    setSubmitting(true);
    formData.append('rating', rating.toString());
    
    const res = await submitFeedback(formData);
    
    if (res?.success) {
      setSuccessMsg(true);
      setStatus('limit_reached'); // Bloqueia imediatamente visualmente
    }
    setSubmitting(false);
  }

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (status === 'loading') return null; // Ou um skeleton

  // CASO 1: Anônimo
  if (status === 'guest') {
    return (
        <section className="bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl p-8 text-center my-16 opacity-70 hover:opacity-100 transition">
            <div className="flex justify-center mb-4 text-stone-400"><Lock size={24} /></div>
            <p className="text-sm text-stone-500 mb-4">Log in to vote on topics and rate us.</p>
            <Link href="/login" className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">
                Login &rarr;
            </Link>
        </section>
    );
  }

  // CASO 2: Já votou este mês (Limit Reached)
  if (status === 'limit_reached') {
    return (
      <div className="bg-stone-50 dark:bg-stone-900 p-10 rounded-xl text-center border border-stone-200 dark:border-stone-800 my-16 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-4 text-green-600 dark:text-green-500">
            <CalendarCheck size={40} />
        </div>
        <h3 className="text-2xl font-serif font-black text-stone-800 dark:text-stone-100 mb-2">
            {successMsg ? "Feedback Received!" : "Thanks for your feedback!"}
        </h3>
        <p className="text-stone-500 max-w-md mx-auto">
            Your opinion helps shape NovaPress. Since we value quality over quantity, you can send new feedback starting on <strong>{nextDate || "next month"}</strong>.
        </p>
      </div>
    );
  }

  // CASO 3: Pode Votar (Formulário)
  return (
    <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-8 shadow-sm my-16 animate-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-serif font-black mb-6 text-center text-black dark:text-white">
        Help us improve
      </h2>
      
      <form action={clientSubmit} className="max-w-xl mx-auto space-y-8">
        
        {/* Topics */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
            Which topics do you prefer?
          </label>
          <div className="flex flex-wrap gap-3">
            {TOPICS.map((topic) => (
              <label key={topic} className="cursor-pointer group">
                <input type="checkbox" name="topics" value={topic} className="peer sr-only" />
                <span className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 text-sm font-medium text-stone-600 dark:text-stone-400 peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black transition-all hover:border-black dark:hover:border-white select-none">
                  {topic}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Suggestion */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
            Suggest a new topic
          </label>
          <input 
            type="text" 
            name="suggestion" 
            placeholder="e.g. Crypto, Politics, Gaming..."
            className="w-full p-3 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-sm dark:text-white placeholder:text-stone-400"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
            Rate NovaPress
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-all hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-stone-200 dark:text-stone-700'}`}
              >
                <Star fill={star <= rating ? "currentColor" : "none"} size={32} />
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={rating === 0 || submitting}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? "Sending..." : <><Send size={16} /> Send Feedback</>}
        </button>

      </form>
    </section>
  );
}