import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getAdminMetrics() {
  const [
    feedbacksRes, 
    totalLogsRes, 
    profilesRes, 
    subsRes,
    dailyTrafficRes, 
    topContentRes   
  ] = await Promise.all([
    supabaseAdmin.from('site_feedback').select('*').order('created_at', { ascending: false }).limit(20),
    supabaseAdmin.from('access_logs').select('*', { count: 'exact', head: true }), // head: true não baixa dados, só conta
    supabaseAdmin.from('profiles').select('id, email'),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_subscriber', true),
    supabaseAdmin.rpc('get_daily_traffic', { days_lookback: 30 }),
    supabaseAdmin.rpc('get_top_content', { limit_count: 5 })
  ]);

  const feedbacks = feedbacksRes.data || [];
  const profiles = profilesRes.data || [];
  const totalSubscribers = subsRes.count || 0;
  const totalLogsCount = totalLogsRes.count || 0; 

  const emailMap = new Map(profiles.map(p => [p.id, p.email]));
  const enrichedFeedbacks = feedbacks.map(f => ({
    ...f,
    user_email: f.user_id ? emailMap.get(f.user_id) || 'Unknown Agent' : 'Anonymous Proxy'
  }));

  const totalRatings = feedbacks.length;
  const sumRatings = feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const avgRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : "0.0";

  const activityChart = dailyTrafficRes.data || [];
  
  const topNews = topContentRes.data || [];

  return {
    kpi: {
      totalUsers: profiles.length,
      totalSubscribers,
      avgRating,
      systemLoad: totalLogsCount 
    },
    charts: {
      topNews,
      activity: activityChart
    },
    raw: {
      feedbacks: enrichedFeedbacks
    }
  };
}