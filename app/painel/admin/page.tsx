import { createClient } from '@/utils/supabase/server';
import { getAdminMetrics } from './data-fetchers';
import { DashboardUI } from './DashboardUI';
import Link from 'next/link'; // <--- Importante: Adicionei isso

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ['pioneer@novapress.com', 'seu-email-real@gmail.com']; // Adicione seus e-mails aqui

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-green-600 font-mono p-4">
            <div className="border border-green-800 p-8 max-w-md text-center bg-green-900/5 shadow-[0_0_20px_rgba(22,163,74,0.1)]">
                <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest animate-pulse text-red-500">Access_Denied</h1>
                <p className="text-sm mb-8 text-green-400/80">
                    Security clearance insufficient for this node.<br/>
                    Identity verification required.
                </p>
                
                <Link 
                  href="/login" 
                  className="inline-block border border-green-600 text-green-500 px-8 py-3 hover:bg-green-600 hover:text-black transition-all duration-300 text-xs font-bold uppercase tracking-widest mb-8"
                >
                  &lt;&lt; Re-Authenticate
                </Link>

                <div className="text-[10px] text-green-900 uppercase tracking-wider border-t border-green-900/30 pt-4">
                    ERR_CODE: 403_FORBIDDEN // SESSION_TERMINATED
                </div>
            </div>
        </div>
    );
  }

  const metrics = await getAdminMetrics();

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-green-900/50 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 animate-pulse rounded-full shadow-[0_0_10px_#22c55e]"></div>
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
                            Command_Center <span className="text-green-600 text-sm align-top">v2.5</span>
                        </h1>
                        <p className="text-[10px] text-green-800 uppercase tracking-widest">
                            Authorized_User: {user.email}
                        </p>
                    </div>
                </div>
                
                <Link href="/" className="text-xs uppercase tracking-widest hover:text-white transition-colors text-right">
                    Exit_Terminal &rarr;
                </Link>
            </div>
            
            <DashboardUI data={metrics} />
        </div>
    </main>
  );
}