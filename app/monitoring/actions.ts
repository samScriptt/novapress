'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// --- NOVA FUNÇÃO: Checa se pode votar ---
export async function checkUserFeedbackStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { canVote: false, reason: 'guest' };

  // Data de 1 mês atrás
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Busca o último feedback deste usuário
  const { data: lastFeedback } = await supabase
    .from('site_feedback')
    .select('created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  // Se nunca votou, libera
  if (!lastFeedback) return { canVote: true };

  // Se votou, verifica a data
  const lastDate = new Date(lastFeedback.created_at);
  
  if (lastDate > oneMonthAgo) {
    // Votou há menos de 1 mês
    // Calcula quando poderá votar novamente
    const nextVoteDate = new Date(lastDate);
    nextVoteDate.setMonth(nextVoteDate.getMonth() + 1);
    
    return { 
      canVote: false, 
      reason: 'limit_reached',
      nextDate: nextVoteDate.toLocaleDateString('pt-BR')
    };
  }

  // Votou há mais de 1 mês, libera
  return { canVote: true };
}


// --- Função de Submit (Atualizada) ---
export async function submitFeedback(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Login necessário." };

  // Re-verifica no servidor (segurança dupla)
  const status = await checkUserFeedbackStatus();
  if (!status.canVote) {
    return { error: "Limite de tempo não atingido." };
  }

  const preferred_topics = formData.getAll('topics') as string[];
  const suggestion = formData.get('suggestion') as string;
  const rating = Number(formData.get('rating'));

  if (rating < 1) return { error: "Dê uma nota válida." };

  await supabase.from('site_feedback').insert({
    user_id: user.id,
    preferred_topics,
    new_topic_suggestion: suggestion,
    rating
  });

  return { success: true };
}

// ... (logSystemEvent mantém igual) ...
export async function logSystemEvent(
    eventType: 'login' | 'view_post' | 'page_view', 
    details: any = {}
  ) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    // Insere de forma "fire and forget" (não bloqueia o app esperando resposta)
    try {
      await supabase.from('access_logs').insert({
        user_id: user?.id || null,
        event_type: eventType,
        event_data: details
      });
    } catch (error) {
      console.error("Falha ao registrar log:", error);
    }
  }