'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Strong password validation
function validatePassword(password: string): string | null {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) return "Password must be at least 8 characters long.";
  if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
  if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
  if (!hasNumbers) return "Password must contain at least one number.";
  if (!hasSpecialChar) return "Password must contain at least one special character (!@#$...).";

  return null; // Valid password
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
    // Translating common Supabase errors
    if (error.message.includes("Invalid login")) {
        return { error: 'Incorrect email or password.' }
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

  // 1. Username Validation
  if (!username || username.length < 3) {
    return { error: 'Username must be at least 3 characters long.' }
  }

  // 2. Strong Password Validation
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError }
  }

  // 3. Create user in Auth
  // We pass the username in 'data' for the SQL Trigger to capture
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  })

  if (error) {
    console.error("Supabase Signup Error:", error) // Logged on the server terminal
    return { error: error.message }
  }
  
  // Extra check: Was the user actually created?
  if (!data.user) {
    return { error: "Unknown error: User was not returned by Supabase." }
  }

  // SUCCESS: We don't need to manually create the profile here.
  // The 'on_auth_user_created' trigger in the database will handle this automatically.

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
