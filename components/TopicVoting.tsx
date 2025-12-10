"use client";

import { useState, useEffect } from "react";
import { submitFeedback, checkUserFeedbackStatus } from "@/app/monitoring/actions";
import { Star, Send, Lock, CalendarCheck, Loader2 } from "lucide-react";
import Link from "next/link";

const TOPICS = ["Tech", "World", "AI", "Economy", "Science"];

export function TopicVoting() {
  const [status, setStatus] = useState<'loading' | 'can_vote' | 'limit_reached' | 'guest'>('loading');
  const [nextDate, setNextDate] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const result = await checkUserFeedbackStatus();
        
        if (!mounted) return;

        if (result.canVote) {
          setStatus('can_vote');
        } else {
          setStatus(result.reason as 'guest' | 'limit_reached');
          if (result.nextDate) setNextDate(result.nextDate);
        }
      } catch (error) {
        console.error("Feedback init failed:", error);
        if (mounted) setStatus('can_vote'); 
      }
    }
    
    init();
    
    return () => { mounted = false; };
  }, []);

  async function clientSubmit(formData: FormData) {
    setSubmitting(true);
    formData.append('rating', rating.toString());
    
    const res = await submitFeedback(formData);
    
    if (res?.success) {
      setSuccessMsg(true);
      setStatus('limit_reached');
    } else if (res?.error) {
      alert(res.error);
    }
    setSubmitting(false);
  }

  // Loading State
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-12 opacity-50">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // CASO 1: Anonymous
  if (status === 'guest') {
    return (
        <section className="bg-zinc-100 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl p-8 text-center my-16 opacity-70 hover:opacity-100 transition font-mono">
            <div className="flex justify-center mb-4 text-zinc-400"><Lock size={24} /></div>
            <p className="text-sm text-zinc-500 mb-4">Log in to vote on topics and rate us.</p>
            <Link href="/login" className="text-blue-600 dark:text-green-500 text-sm font-bold hover:underline uppercase">
                Login_System &rarr;
            </Link>
        </section>
    );
  }

  // CASO 2: Voted (Limit Reached)
  if (status === 'limit_reached') {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-xl text-center border border-zinc-200 dark:border-zinc-800 my-16 animate-in fade-in zoom-in duration-500 font-mono">
        <div className="flex justify-center mb-4 text-green-600 dark:text-green-500">
            <CalendarCheck size={40} />
        </div>
        <h3 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
            {successMsg ? "Feedback Received!" : "Input Recorded"}
        </h3>
        <p className="text-zinc-500 max-w-md mx-auto text-sm">
            Your data has been processed. Next input window opens on: <br/>
            <strong className="text-black dark:text-white">{nextDate || "next month"}</strong>.
        </p>
      </div>
    );
  }

  // CASO 3: Can Vote (Form)
  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm my-16 animate-in slide-in-from-bottom-4 font-mono">
      <h2 className="text-2xl font-black mb-8 text-center text-black dark:text-white uppercase tracking-tight">
        System_Feedback_Module
      </h2>
      
      <form action={clientSubmit} className="max-w-xl mx-auto space-y-8">
        
        {/* Topics */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Select Priority Topics
          </label>
          <div className="flex flex-wrap gap-3">
            {TOPICS.map((topic) => (
              <label key={topic} className="cursor-pointer group">
                <input type="checkbox" name="topics" value={topic} className="peer sr-only" />
                <span className="px-4 py-2 rounded-sm border border-zinc-300 dark:border-zinc-700 text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400 peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-green-600 dark:peer-checked:text-black dark:peer-checked:border-green-600 transition-all hover:border-black dark:hover:border-green-500 select-none">
                  {topic}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Suggestion */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            New Topic Injection
          </label>
          <input 
            type="text" 
            name="suggestion" 
            placeholder="e.g. Cybersecurity, Quantum Computing..."
            className="w-full p-3 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-green-500 outline-none text-sm dark:text-green-400 placeholder:text-zinc-400 rounded-sm transition-all"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            System Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-all hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-zinc-200 dark:text-zinc-800'}`}
              >
                <Star fill={star <= rating ? "currentColor" : "none"} size={28} />
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={rating === 0 || submitting}
          className="w-full bg-blue-600 dark:bg-green-600 text-white dark:text-black font-bold py-3 uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-sm"
        >
          {submitting ? "Transmitting..." : <><Send size={16} /> Submit_Data</>}
        </button>

      </form>
    </section>
  );
}