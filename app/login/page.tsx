'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Loader2, ArrowLeft, Terminal, Cpu, Globe, Activity } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMsg('')
    const formData = new FormData(event.currentTarget)
    const res = isLogin ? await login(formData) : await signup(formData)
    if (res?.error) {
      setMsg(res.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 transition-colors duration-300 font-sans">
      
      {/* --- LEFT SIDE: TECH EDITORIAL COVER --- */}
      <div className="relative hidden lg:flex flex-col justify-between p-16 bg-zinc-900 text-white overflow-hidden">
        
        {/* Abstract / Tech Background Image */}
        <div className="absolute inset-0 z-0">
             <div 
                className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/40 to-black/80"></div>
            
            {/* Subtle Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>
        </div>

        {/* Brand & Technical Header */}
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="bg-white text-black p-1.5 rounded-sm">
                    <Terminal size={20} />
                </div>
                <span className="font-serif font-black text-2xl tracking-tighter">NovaPress.</span>
            </div>
            
            <div className="flex flex-col items-end text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                <span className="flex items-center gap-2 text-green-400">
                    <Activity size={10} className="animate-pulse" /> System_Online
                </span>
                <span>v.2.5.0-stable</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-lg mt-auto mb-auto">
            <div className="mb-6 inline-block border border-white/20 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">
                    Autonomous Intelligence Stream
                </span>
            </div>
            
            <h2 className="font-serif text-5xl md:text-6xl font-medium leading-none mb-8 text-white">
                Separating signal from noise in a <span className="italic text-zinc-400">complex world</span>.
            </h2>
            
            <div className="pl-6 border-l-2 border-blue-500/80">
                <p className="text-zinc-300 font-mono text-xs leading-relaxed max-w-sm uppercase tracking-wide">
                    Powered by Gemini AI.<br/>
                    Curated for the informed mind.
                </p>
            </div>
        </div>

        {/* Technical Footer */}
        <div className="relative z-10 border-t border-white/10 pt-6 flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <div className="flex gap-6">
                <span>Secure_Connection_TLS</span>
                <span>Latency: 12ms</span>
            </div>
            <div>
                Data_Center: US_East
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: CLEAN FORM --- */}
      <div className="flex flex-col justify-center items-center p-8 lg:p-24 relative bg-white dark:bg-[#09090b]">
        
        <Link 
          href="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 hover:text-black dark:hover:text-white transition-colors group"
        >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back_to_Feed
        </Link>

        <div className="w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="mb-10 text-center">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-sm flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    {isLogin ? <Cpu size={24} className="text-zinc-900 dark:text-zinc-200" strokeWidth={1.5} /> : <Globe size={24} className="text-zinc-900 dark:text-zinc-200" strokeWidth={1.5} />}
                </div>
                <h2 className="text-3xl font-serif font-black text-zinc-900 dark:text-white mb-3">
                    {isLogin ? 'Subscriber Access' : 'Join the Network'}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wide">
                    {isLogin ? 'Authenticate to unlock full content.' : 'Initialize your reader profile.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold uppercase text-zinc-500 ml-1">Username_ID</label>
                        <input 
                            name="username" 
                            type="text" 
                            required 
                            placeholder="e.g. news_junkie"
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white outline-none transition-all placeholder:text-zinc-400 font-sans"
                        />
                    </div>
                )}
                
                <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-500 ml-1">Email_Address</label>
                    <input 
                        name="email" 
                        type="email" 
                        required 
                        placeholder="user@domain.com"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white outline-none transition-all placeholder:text-zinc-400 font-sans"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-500 ml-1">Access_Key (Password)</label>
                    <input 
                        name="password" 
                        type="password" 
                        required 
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm text-sm focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white outline-none transition-all placeholder:text-zinc-400 font-sans"
                    />
                </div>

                {msg && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-bold font-mono uppercase rounded-sm border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> SYSTEM ERROR: {msg}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold font-mono text-xs py-4 rounded-sm hover:opacity-90 active:scale-[0.99] transition-all shadow-lg shadow-zinc-200 dark:shadow-none flex justify-center items-center gap-2 uppercase tracking-widest border border-transparent hover:border-zinc-500"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : (isLogin ? '>> Authenticate' : '>> Initialize_Account')}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center">
                <p className="text-xs text-zinc-500 font-sans">
                    {isLogin ? "New to NovaPress?" : "Already verified?"}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setMsg(''); }}
                        className="ml-1.5 font-bold text-black dark:text-white hover:underline underline-offset-4 decoration-zinc-400"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>

        </div>
      </div>
    </main>
  )
}
