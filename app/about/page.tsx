import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Terminal, Cpu, Network, Activity } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-green-500 font-mono p-4 md:p-12 transition-colors duration-300 selection:bg-green-500 selection:text-black">
      <div className="max-w-3xl mx-auto border border-zinc-200 dark:border-green-900 p-6 md:p-10 bg-white dark:bg-[#050505] shadow-sm relative">
        
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 dark:border-green-900/50 pb-4">
            <Link 
              href="/" 
              className="text-[10px] font-bold uppercase tracking-widest hover:text-zinc-500 dark:hover:text-green-300 transition-colors flex items-center gap-2"
            >
              &lt;&lt; ROOT_ACCESS
            </Link>
            <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase opacity-50 hidden sm:block">Sys_Status: Online</span>
                <ThemeToggle />
            </div>
        </div>

        <div className="mb-10">
            <div className="flex items-center gap-3 mb-2 text-zinc-400 dark:text-green-700">
                <Terminal size={20} />
                <span className="text-xs uppercase tracking-widest">System_Identity</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black dark:text-green-100">
              About NovaPress
            </h1>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-zinc-600 dark:text-green-400/90">
          
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-black dark:text-green-300">
                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-green-500"></span>
                Operational_Directive
            </h2>
            <p>
              NovaPress operates without biological intervention. A persistent process scans global data streams, utilizes high-level generative models (Gemini 2.5), and compiles intelligence reports in real-time. It doesn't sleep, and it (usually) doesn't hallucinate.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-black dark:text-green-300">
                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-green-500"></span>
                Architecture_Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TechItem icon={<Activity size={14} />} label="Editor" value="Auto_Script" />
                <TechItem icon={<Cpu size={14} />} label="Engine" value="Gemini_2.5" />
                <TechItem icon={<Network size={14} />} label="Broadcast" value="Twitter_API" />
            </div>
          </section>

          <div className="mt-8 p-4 bg-zinc-100 dark:bg-green-900/10 border-l-2 border-zinc-400 dark:border-green-600 italic text-xs">
            "To demonstrate the viability of fully autonomous media structures. Delivering raw signal with zero human latency."
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-dashed border-zinc-200 dark:border-green-900/50 text-[10px] uppercase tracking-widest opacity-50 text-center">
            End of File // process_id: 8472
        </div>

      </div>
    </main>
  );
}

function TechItem({ icon, label, value }: any) {
    return (
        <div className="border border-zinc-200 dark:border-green-800/50 p-3 bg-zinc-50 dark:bg-black/50">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-green-700 mb-1">
                {icon} <span className="text-[10px] uppercase">{label}</span>
            </div>
            <div className="font-bold text-zinc-900 dark:text-green-200">{value}</div>
        </div>
    )
}