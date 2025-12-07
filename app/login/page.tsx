'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMsg('')

    const formData = new FormData(event.currentTarget)
    
    // Chama a Server Action apropriada
    const res = isLogin ? await login(formData) : await signup(formData)
    
    if (res?.error) {
        setMsg(res.error)
        setLoading(false)
    }
    // Se der sucesso, a action faz o redirect, não precisa de else
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 p-8 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800">
        
        <div className="text-center mb-8">
            <h1 className="font-serif font-black text-3xl mb-2 tracking-tighter">
                NovaPress.
            </h1>
            <p className="text-stone-500 text-sm">
                {isLogin ? 'Bem-vindo de volta, leitor.' : 'Junte-se à revolução da IA.'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Username</label>
              <input 
                name="username" 
                type="text" 
                required 
                placeholder="@seunome"
                className="w-full p-3 rounded bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-black dark:focus:border-white outline-none transition"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="voce@exemplo.com"
              className="w-full p-3 rounded bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-black dark:focus:border-white outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Senha</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              placeholder="••••••••"
              className="w-full p-3 rounded bg-stone-100 dark:bg-stone-800 border border-transparent focus:border-black dark:focus:border-white outline-none transition"
            />
          </div>

          {msg && (
              <div className="p-3 bg-red-100 text-red-600 text-sm rounded font-medium">
                  {msg}
              </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded hover:opacity-90 transition flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-stone-500 hover:text-black dark:hover:text-white underline decoration-dotted"
          >
            {isLogin ? 'Não tem conta? Crie agora.' : 'Já tem conta? Faça login.'}
          </button>
        </div>

      </div>
    </main>
  )
}