import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getAdminMetrics() {
  const [feedbacksRes, logsRes, profilesRes, subsRes] = await Promise.all([
    supabaseAdmin.from('site_feedback').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('access_logs').select('*').order('created_at', { ascending: false }).limit(5000), // Mais logs para precisão
    supabaseAdmin.from('profiles').select('id, email'), // Busca e-mails
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_subscriber', true)
  ]);

  const feedbacks = feedbacksRes.data || [];
  const logs = logsRes.data || [];
  const profiles = profilesRes.data || [];
  const totalSubscribers = subsRes.count || 0;

  const emailMap = new Map(profiles.map(p => [p.id, p.email]));

  const enrichedFeedbacks = feedbacks.map(f => ({
    ...f,
    user_email: f.user_id ? emailMap.get(f.user_id) || 'Unknown Agent' : 'Anonymous Proxy'
  }));


  const totalRatings = feedbacks.length;
  const sumRatings = feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const avgRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : "0.0";

  const viewsCount: Record<string, number> = {};
  logs
    .filter(l => l.event_type === 'view_post')
    .forEach(l => {
      const key = l.event_data?.post_title 
        ? (l.event_data.post_title.length > 40 ? l.event_data.post_title.slice(0, 40) + '...' : l.event_data.post_title)
        : `LOG_ID_${l.event_data?.post_id}`;
      viewsCount[key] = (viewsCount[key] || 0) + 1;
    });

  const topNews = Object.entries(viewsCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const activityMap: Record<string, number> = {};
  logs.forEach(l => {
    const date = new Date(l.created_at).toLocaleDateString('pt-BR');
    activityMap[date] = (activityMap[date] || 0) + 1;
  });
  const activityChart = Object.entries(activityMap)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 7)
    .reverse();

  return {
    kpi: {
      totalUsers: profiles.length,
      totalSubscribers,
      avgRating,
      systemLoad: logs.length
    },
    charts: {
      topNews,
      activity: activityChart
    },
    raw: {
      feedbacks: enrichedFeedbacks.slice(0, 20)
    }
  };
}