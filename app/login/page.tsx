'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Loader2, Newspaper, Cpu, ArrowLeft } from 'lucide-react'
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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-stone-50 dark:bg-stone-950">
      
      {/* --- LADO VISUAL (ESQUERDA) --- */}
      {/* Só aparece em telas grandes (lg) */}
      <div className="relative hidden lg:flex flex-col justify-between p-16 bg-stone-900 text-white overflow-hidden h-full">
        
        {/* Background Imagem com Overlay */}
        <div className="absolute inset-0 opacity-30 select-none pointer-events-none">
            {/* Imagem de fundo genérica estilo jornal/tech */}
            <div 
                className="absolute inset-0 bg-cover bg-center filter grayscale contrast-125"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
        </div>

        {/* Marca */}
        <div className="relative z-10">
            <Link href="/" className="inline-block group">
                <h1 className="font-serif font-black text-5xl tracking-tighter flex items-center gap-2 group-hover:opacity-90 transition">
                    NovaPress.
                </h1>
            </Link>
        </div>

        {/* Frase de Efeito (Estilo Depoimento/Manifesto) */}
        <div className="relative z-10 max-w-lg">
            <blockquote className="text-3xl font-serif leading-tight mb-6">
                "A informação não dorme. O jornalismo do futuro é autônomo, curado por IA e entregue em tempo real."
            </blockquote>
            <div className="flex gap-6 text-stone-400 text-xs font-bold font-sans uppercase tracking-widest">
                <div className="flex items-center gap-2"><Newspaper size={16} /> Curadoria 24/7</div>
                <div className="flex items-center gap-2"><Cpu size={16} /> Powered by Gemini</div>
            </div>
        </div>

        {/* Footer do Painel */}
        <div className="relative z-10 text-xs text-stone-500 font-mono">
            &copy; {new Date().getFullYear()} NovaPress Autonomous Media.
        </div>
      </div>

      {/* --- LADO DO FORMULÁRIO (DIREITA) --- */}
      <div className="flex items-center justify-center p-8 lg:p-24 text-stone-900 dark:text-stone-100 transition-colors relative">
        
        {/* Botão voltar flutuante mobile */}
        <Link href="/" className="absolute top-8 left-8 lg:hidden text-stone-500 hover:text-black dark:hover:text-white">
            <ArrowLeft size={24} />
        </Link>

        <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
            
            <div className="text-center lg:text-left space-y-2">
                <h2 className="text-4xl font-black font-serif tracking-tight">
                    {isLogin ? 'Bem-vindo de volta.' : 'Crie sua conta.'}
                </h2>
                <p className="text-stone-500 text-sm font-sans">
                    {isLogin ? 'Digite suas credenciais para acessar o painel.' : 'Junte-se à nossa comunidade de leitores.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wide text-stone-500 ml-1">Username</label>
                        <input 
                            name="username" 
                            type="text" 
                            required 
                            placeholder="@seunome"
                            className="w-full p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder:text-stone-400"
                        />
                    </div>
                )}
                
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide text-stone-500 ml-1">Email</label>
                    <input 
                        name="email" 
                        type="email" 
                        required 
                        placeholder="voce@exemplo.com"
                        className="w-full p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder:text-stone-400"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold uppercase tracking-wide text-stone-500">Senha</label>
                    </div>
                    <input 
                        name="password" 
                        type="password" 
                        required 
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder:text-stone-400"
                    />
                </div>

                {msg && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {msg}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-4 rounded-lg hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-stone-200 dark:shadow-none flex justify-center items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={20} />}
                    {isLogin ? 'Entrar na Plataforma' : 'Criar Conta Gratuita'}
                </button>
            </form>

            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-stone-200 dark:border-stone-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest">
                        <span className="bg-stone-50 dark:bg-stone-950 px-4 text-stone-400">Opções</span>
                    </div>
                </div>

                <p className="text-sm text-stone-600 dark:text-stone-400">
                    {isLogin ? 'Ainda não é assinante?' : 'Já possui cadastro?'}
                    <button 
                        onClick={() => { setIsLogin(!isLogin); setMsg(''); }}
                        className="ml-2 font-bold text-black dark:text-white hover:underline underline-offset-4 decoration-2"
                    >
                        {isLogin ? 'Cadastre-se' : 'Fazer Login'}
                    </button>
                </p>
            </div>

        </div>
      </div>
    </main>
  )
}