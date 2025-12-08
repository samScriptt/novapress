import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/session' // ou server-middleware, dependendo de como salvou

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // PROTEGE APENAS: Rotas de API e Admin (se houver no futuro)
    // LIBERA: Todo o resto (Home, Post, Category, etc)
    '/api/auth/:path*',
    '/painel/:path*', 
    // O matcher antigo bloqueava tudo que não era estático. 
    // Agora removemos a restrição global.
  ],
}