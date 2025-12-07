'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Validação de senha forte
function validatePassword(password: string): string | null {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) return "A senha deve ter pelo menos 8 caracteres.";
  if (!hasUpperCase) return "A senha deve conter pelo menos uma letra maiúscula.";
  if (!hasLowerCase) return "A senha deve conter pelo menos uma letra minúscula.";
  if (!hasNumbers) return "A senha deve conter pelo menos um número.";
  if (!hasSpecialChar) return "A senha deve conter pelo menos um caractere especial (!@#$...).";

  return null; // Senha válida
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Traduzindo erros comuns do Supabase
    if (error.message.includes("Invalid login")) {
        return { error: 'E-mail ou senha incorretos.' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // 1. Validação de Username
  if (!username || username.length < 3) {
    return { error: 'O nome de usuário deve ter no mínimo 3 caracteres.' }
  }

  // 2. Validação de Senha Forte
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError }
  }

  // 3. Cria o usuário no Auth
  // Passamos o username no 'data' para o Trigger do SQL pegar
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, 
      },
    },
  })

  if (error) {
    return { error: `Erro no cadastro: ${error.message}` }
  }

  // SUCESSO: Não precisamos criar o perfil manualmente aqui.
  // O Trigger 'on_auth_user_created' no banco fará isso automaticamente e sem erros de RLS.

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}