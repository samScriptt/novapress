'use server';

import { createClient } from '@/utils/supabase/server';

// --- 1. Checagem de Status (Faltava essa função) ---
export async function checkUserFeedbackStatus() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { canVote: false, reason: 'guest' };

    // Data de 1 mês atrás
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Busca o último feedback deste usuário
    const { data: lastFeedback, error } = await supabase
      .from('site_feedback')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(); // Use maybeSingle para não dar erro se não tiver nada

    if (error) {
      console.error("Erro ao checar feedback:", error);
      // Em caso de erro no banco (ex: RLS), liberamos o voto para não travar a UI
      return { canVote: true };
    }

    console.log(lastFeedback)

    // Se nunca votou, libera
    if (!lastFeedback) return { canVote: true };

    // Se votou, verifica a data
    const lastDate = new Date(lastFeedback.created_at);
    
    if (lastDate > oneMonthAgo) {
      const nextVoteDate = new Date(lastDate);
      nextVoteDate.setMonth(nextVoteDate.getMonth() + 1);
      
      return { 
        canVote: false, 
        reason: 'limit_reached',
        nextDate: nextVoteDate.toLocaleDateString('pt-BR')
      };
    }

    return { canVote: true };

  } catch (err) {
    console.error("Erro crítico feedback:", err);
    return { canVote: true }; // Fallback seguro
  }
}

// --- 2. Salvar Feedback ---
export async function submitFeedback(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Login required." };

  const status = await checkUserFeedbackStatus();
  if (!status.canVote) return { error: "You have already voted recently." };

  const preferred_topics = formData.getAll('topics') as string[];
  const suggestion = formData.get('suggestion') as string;
  const rating = Number(formData.get('rating'));

  if (rating < 1 || rating > 5) return { error: "Invalid rating." };

  const { error } = await supabase.from('site_feedback').insert({
    user_id: user.id,
    preferred_topics,
    new_topic_suggestion: suggestion,
    rating
  });

  if (error) return { error: "Failed to save. Try again." };

  return { success: true };
}

// --- 3. Logs ---
export async function logSystemEvent(
  eventType: 'login' | 'view_post' | 'page_view', 
  details: any = {}
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  try {
    await supabase.from('access_logs').insert({
      user_id: user?.id || null,
      event_type: eventType,
      event_data: details
    });
  } catch (error) {
    // Silencioso
  }
}