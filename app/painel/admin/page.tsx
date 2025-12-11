import { createClient } from '@/utils/supabase/server';
import { getAdminMetrics } from './data-fetchers';
import { DashboardUI } from './DashboardUI';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ['pioneer@novapress.com'];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return (
        // Alterado de bg-black para bg-zinc-950
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-emerald-600 font-mono">
            <div className="border border-emerald-900/50 p-8 max-w-md text-center bg-emerald-900/5 rounded-xl">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest text-emerald-500">Access Restricted</h1>
                <p className="text-sm mb-6 text-zinc-400">Your security clearance is insufficient for this node.</p>
                <div className="text-xs font-mono text-zinc-600 bg-zinc-900 p-2 rounded">ERR_CODE: 403_FORBIDDEN</div>
            </div>
        </div>
    );
  }

  const metrics = await getAdminMetrics();

  return (
    // Fundo alterado para bg-zinc-950 e fonte padrão para sans (com mono apenas onde necessário)
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-sans p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Command Center
                        </h1>
                        <p className="text-zinc-500 text-sm">System Overview & Analytics</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    LIVE_FEED
                </div>
            </div>
            
            <DashboardUI data={metrics} />
        </div>
    </main>
  );
}