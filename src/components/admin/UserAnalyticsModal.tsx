import React from 'react';
import { X, TrendingUp, Calendar, Activity, Zap, ShieldAlert, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useWeightLogs, useExerciseLogs, usePainLogs, useAuditLogs } from '@/hooks/useLogs';

interface UserAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function UserAnalyticsModal({ isOpen, onClose, user }: UserAnalyticsModalProps) {
  const { data: weightLogs = [] } = useWeightLogs(user?.id);
  const { data: exerciseLogs = [] } = useExerciseLogs(user?.id);
  const { data: painLogs = [] } = usePainLogs(user?.id);
  const { data: auditLogs = [] } = useAuditLogs(user?.id);

  const [activeTab, setActiveTab] = React.useState<'health' | 'audit'>('health');

  const mockAdherenceData = [
    { date: '2026-04-10', score: 85 },
    { date: '2026-04-12', score: 92 },
    { date: '2026-04-14', score: 40 },
    { date: '2026-04-16', score: 88 },
    { date: '2026-04-18', score: 95 },
  ];

  if (!isOpen || !user) return null;

  const avgRpe = exerciseLogs.length > 0 
    ? (exerciseLogs.reduce((acc: number, l: any) => acc + (l.avgRpe || 0), 0) / exerciseLogs.length).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Activity className="size-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{user.fullName || 'Member Profile'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="bg-white/5 p-1 rounded-xl flex gap-1 ml-4">
                  <button 
                    onClick={() => setActiveTab('health')}
                    className={cn("px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'health' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
                  >
                    Biometrics
                  </button>
                  <button 
                    onClick={() => setActiveTab('audit')}
                    className={cn("px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'audit' ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" : "text-muted-foreground hover:text-white")}
                  >
                    Audit Trail
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
            <X className="size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'health' ? (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Consistency', value: exerciseLogs.length > 0 ? `${(exerciseLogs.length / 3).toFixed(0)}%` : '0%', icon: Zap, color: 'text-primary' },
                  { label: 'Weekly Avg RPE', value: avgRpe, icon: Activity, color: 'text-amber-400' },
                  { label: 'Risk Profile', value: painLogs.length > 0 && painLogs[0].painLevel > 5 ? 'High Risk' : 'Stable', icon: ShieldAlert, color: 'text-emerald-400' },
                  { label: 'Total Sessions', value: exerciseLogs.length.toString(), icon: Calendar, color: 'text-blue-400' },
                ].map((stat, i) => (
                  <Card key={i} className="glass p-5 border-white/5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                      <stat.icon className={cn("size-3", stat.color)} /> {stat.label}
                    </div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* adherence Chart */}
                <Card className="lg:col-span-2 glass border-white/5 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Adherence Trend (30D)</h3>
                    <TrendingUp className="size-4 text-primary" />
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockAdherenceData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4fb6b2" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4fb6b2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          itemStyle={{ color: '#4fb6b2' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#4fb6b2" 
                          strokeWidth={2} 
                          fillOpacity={1} 
                          fill="url(#colorScore)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Recent Activity Mini-Feed */}
                <Card className="glass border-white/5 p-6 flex flex-col">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Recent Activity</h3>
                  <div className="space-y-4 flex-1">
                    {exerciseLogs.slice(0, 3).map((act: any, i: number) => (
                      <div key={i} className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div className="size-2 rounded-full bg-primary/40 mt-1.5" />
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{act.exerciseName}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{act.sets} Sets Completed</div>
                          <div className="text-[9px] text-primary font-bold uppercase mt-1">{new Date(act.timestamp).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Administrative Audit History</h3>
               <div className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden">
                  <div className="grid grid-cols-[150px,200px,1fr] gap-px bg-white/5">
                     <div className="bg-[#0F1115] p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</div>
                     <div className="bg-[#0F1115] p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</div>
                     <div className="bg-[#0F1115] p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Details</div>

                     {auditLogs.length > 0 ? auditLogs.map((log: any) => (
                       <React.Fragment key={log.id}>
                          <div className="bg-background p-5 text-[10px] text-muted-foreground font-bold">{new Date(log.createdAt).toLocaleString()}</div>
                          <div className="bg-background p-5">
                             <Badge className={cn(
                               "text-[9px] font-black tracking-widest uppercase",
                               log.action === 'role_change' ? "bg-purple-500/10 text-purple-400" : "bg-amber-500/10 text-amber-400"
                             )}>
                               {log.action.replace('_', ' ')}
                             </Badge>
                          </div>
                          <div className="bg-background p-5 text-sm text-white font-medium italic opacity-80">{log.details}</div>
                       </React.Fragment>
                     )) : (
                       <div className="col-span-3 bg-background p-10 text-center text-xs text-muted-foreground italic">No administrative history found for this member.</div>
                     )}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
          <Badge className="bg-primary/10 text-primary border-primary/20">MEMBER SINCE APRIL 2026</Badge>
          <div className="flex gap-3">
             <Button className="bg-white/5 border border-white/10 text-white font-bold h-12 rounded-2xl px-8" onClick={onClose}>
                Close Modal
             </Button>
          </div>
        </div>
        </div>
      </div>
  );
}
