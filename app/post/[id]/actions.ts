'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addComment(formData: FormData) {
  const supabase = await createClient();
  const content = formData.get('content') as string;
  const postId = formData.get('postId') as string;

  // 1. Check user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to comment.' };

  if (!content.trim()) return { error: 'Empty comment.' };

  // 2. Insert comment
  const { error } = await supabase.from('comments').insert({
    content,
    post_id: postId,
    user_id: user.id
  });

  if (error) return { error: error.message };

  revalidatePath(`/post/${postId}`);
  return { success: true };
}

export async function toggleVote(postId: string, type: 'like' | 'dislike') {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Login required' }; // Handled on frontend with redirect

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('likes')
    .select('vote_type')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existingVote) {
    if (existingVote.vote_type === type) {
      // If clicked the same vote, remove (toggle off)
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      // If changed (like -> dislike), update
      await supabase.from('likes').update({ vote_type: type }).eq('post_id', postId).eq('user_id', user.id);
    }
  } else {
    // New vote
    await supabase.from('likes').insert({
      post_id: postId,
      user_id: user.id,
      vote_type: type
    });
  }

  revalidatePath(`/post/${postId}`);
  return { success: true };
}
