"use client";

import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid
} from 'recharts';
// Adicionei 'Star' na lista de importações abaixo
import { Terminal, Shield, Cpu, Activity, TrendingUp, Users, Star } from 'lucide-react';

export function DashboardUI({ data }: { data: any }) {
  const { kpi, charts, raw } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Bar: Status do Sistema */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
                <span className="block text-zinc-400 text-[10px] uppercase tracking-widest font-bold">System Status</span>
                <span className="text-zinc-100 text-sm font-medium">All Systems Operational</span>
            </div>
        </div>
        <div className="flex gap-6 text-right mt-4 md:mt-0">
            <div>
                <span className="block text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Uptime</span>
                <span className="text-emerald-400 font-mono text-sm">99.9%</span>
            </div>
            <div>
                <span className="block text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Latency</span>
                <span className="text-emerald-400 font-mono text-sm">24ms</span>
            </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CmdCard 
          label="Total Agents" 
          value={kpi.totalUsers} 
          sub={`${kpi.totalSubscribers} Premium Users`}
          icon={<Users size={18} className="text-emerald-500" />}
          trend="+12%" 
        />
        <CmdCard 
          label="Satisfaction Score" 
          value={kpi.avgRating} 
          sub="Based on recent feedback"
          icon={<Activity size={18} className="text-blue-500" />}
          trend="Stable"
        />
        <CmdCard 
          label="Event Logs" 
          value={kpi.systemLoad} 
          sub="Events in buffer"
          icon={<Terminal size={18} className="text-purple-500" />}
        />
        <CmdCard 
          label="Est. Revenue (MRR)" 
          value={`$${kpi.totalSubscribers * 1}.00`} 
          sub="Monthly Recurring"
          icon={<Shield size={18} className="text-amber-500" />}
          isCurrency
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1 */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-zinc-100 font-semibold">Top Accessed Content</h3>
                    <p className="text-zinc-500 text-xs">Most viewed news articles by agents</p>
                </div>
                <TrendingUp size={16} className="text-zinc-600" />
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.topNews} layout="vertical" margin={{ left: 0, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={150} 
                            tick={{fill: '#a1a1aa', fontSize: 11}} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: '#27272a', opacity: 0.4}}
                            contentStyle={{ 
                                backgroundColor: '#18181b', 
                                borderColor: '#3f3f46', 
                                color: '#fff',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <Bar 
                            dataKey="value" 
                            fill="#10b981" 
                            radius={[0, 4, 4, 0]} 
                            barSize={20} 
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Gráfico 2 */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-zinc-100 font-semibold">Traffic Analysis</h3>
                    <p className="text-zinc-500 text-xs">System interaction volume over time</p>
                </div>
                <Activity size={16} className="text-zinc-600" />
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={charts.activity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            tick={{fill: '#71717a', fontSize: 11}} 
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#18181b', 
                                borderColor: '#3f3f46', 
                                color: '#fff',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            dot={{r: 4, fill: '#18181b', strokeWidth: 2}} 
                            activeDot={{r: 6}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Tabela de Feedback */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div>
                <h3 className="text-sm font-semibold text-zinc-200">Recent User Feedback</h3>
                <p className="text-zinc-500 text-xs">Real-time suggestions and ratings stream</p>
            </div>
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-zinc-500 font-medium border-b border-zinc-800 bg-zinc-900/80">
                    <tr>
                        <th className="px-6 py-4 font-normal">User Identity</th>
                        <th className="px-6 py-4 font-normal">Rating</th>
                        <th className="px-6 py-4 font-normal">Interests</th>
                        <th className="px-6 py-4 font-normal">Suggestion</th>
                        <th className="px-6 py-4 font-normal text-right">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {raw.feedbacks.map((f: any) => (
                        <tr key={f.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="text-zinc-200 font-medium">
                                    {f.user_email?.split('@')[0] || 'Anonymous'}
                                </div>
                                <div className="text-zinc-500 text-xs font-mono">
                                    {f.user_email || 'NO_ID'}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={12} 
                                            className={i < f.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'} 
                                        />
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {f.preferred_topics?.length > 0 ? (
                                        f.preferred_topics.map((t: string) => (
                                            <span key={t} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                                                {t}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-zinc-400 italic max-w-xs truncate">
                                {f.new_topic_suggestion ? `"${f.new_topic_suggestion}"` : <span className="opacity-20">No suggestion</span>}
                            </td>
                            <td className="px-6 py-4 text-right text-zinc-500 font-mono text-xs">
                                {new Date(f.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}

function CmdCard({ label, value, sub, icon, trend, isCurrency }: any) {
    return (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-black/50 group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-zinc-800/50 rounded-lg text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {icon}
                </div>
                {trend && (
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20">
                        {trend}
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</span>
                <div className={`text-3xl font-bold text-white tracking-tight ${isCurrency ? 'font-sans' : 'font-mono'}`}>
                    {value}
                </div>
                <div className="text-xs text-zinc-500 pt-1 border-t border-zinc-800/50 mt-3">
                    {sub}
                </div>
            </div>
        </div>
    )
}