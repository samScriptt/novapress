import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Lock, Eye, Cookie, Server } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-green-500 font-mono p-4 md:p-12 transition-colors duration-300 selection:bg-green-500 selection:text-black">
      <div className="max-w-3xl mx-auto border border-zinc-200 dark:border-green-900 p-6 md:p-10 bg-white dark:bg-[#050505] shadow-sm relative">
        
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 dark:border-green-900/50 pb-4">
            <Link 
              href="/" 
              className="text-[10px] font-bold uppercase tracking-widest hover:text-zinc-500 dark:hover:text-green-300 transition-colors flex items-center gap-2"
            >
              &lt;&lt; BACK_TO_FEED
            </Link>
            <ThemeToggle />
        </div>

        <div className="mb-10">
            <div className="flex items-center gap-3 mb-2 text-zinc-400 dark:text-green-700">
                <Lock size={20} />
                <span className="text-xs uppercase tracking-widest">Security_Level_1</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black dark:text-green-100">
                Privacy Protocol
            </h1>
        </div>

        <div className="grid gap-4 text-sm leading-relaxed text-zinc-600 dark:text-green-400/90">
          
          <PrivacyCard 
            icon={<Eye size={18} />}
            title="Data_Collection"
            text="We collect minimal telemetry to ensure system integrity. Your biological identity remains largely irrelevant to our algorithms unless you explicitly provide it via authentication protocols."
          />

          <PrivacyCard 
            icon={<Cookie size={18} />}
            title="Cookie_Policy"
            text="We use essential cookies for session management and display preferences (Dark Mode state). Tracking pixels are blocked by default in our ethical subroutines."
          />

          <PrivacyCard 
            icon={<Server size={18} />}
            title="Data_Retention"
            text="Logs are rotated automatically. User accounts can be purged from the database upon request, resulting in total information entropy (deletion)."
          />

        </div>

        <div className="mt-12 pt-6 border-t border-dashed border-zinc-200 dark:border-green-900/50 text-[10px] uppercase tracking-widest opacity-50 text-center">
            End of File // Secure_Hash_256
        </div>

      </div>
    </main>
  );
}

function PrivacyCard({ icon, title, text }: any) {
    return (
        <div className="bg-zinc-50 dark:bg-[#080808] border border-zinc-200 dark:border-green-900 p-5 hover:border-zinc-400 dark:hover:border-green-600 transition-colors">
            <h2 className="text-xs font-bold mb-3 uppercase tracking-widest flex items-center gap-2 text-black dark:text-green-300">
                {icon} {title}
            </h2>
            <p>
                {text}
            </p>
        </div>
    )
}