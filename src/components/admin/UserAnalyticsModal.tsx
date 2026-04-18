import React from 'react';
import { X, TrendingUp, Calendar, Activity, Zap, ShieldAlert, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface UserAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const mockAdherenceData = [
  { date: '2026-04-10', score: 85 },
  { date: '2026-04-12', score: 92 },
  { date: '2026-04-14', score: 40 },
  { date: '2026-04-16', score: 88 },
  { date: '2026-04-18', score: 95 },
];

export function UserAnalyticsModal({ isOpen, onClose, user }: UserAnalyticsModalProps) {
  if (!isOpen || !user) return null;

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
                <span className="size-1 rounded-full bg-white/20" />
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0 text-[10px]">ACTIVE MEMBER</Badge>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
            <X className="size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Consistency', value: '94%', icon: Zap, color: 'text-primary' },
              { label: 'Weekly Avg RPE', value: '7.2', icon: Activity, color: 'text-amber-400' },
              { label: 'Risk Profile', value: 'Stable', icon: ShieldAlert, color: 'text-emerald-400' },
              { label: 'Last Log', value: '2h ago', icon: Calendar, color: 'text-blue-400' },
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
                {[
                  { activity: 'Logged Workout', time: '2h ago', detail: 'Advanced Calisthenics' },
                  { activity: 'Macro Goal Met', time: '5h ago', detail: '2,100 kcal / 115g Prom' },
                  { activity: 'Weight Update', time: '1d ago', detail: '75.2 kg (-0.4kg)' },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="size-2 rounded-full bg-primary/40 mt-1.5" />
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{act.activity}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{act.detail}</div>
                      <div className="text-[9px] text-primary font-bold uppercase mt-1">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-xs text-muted-foreground hover:text-white">
                View Full Log History <ChevronRight className="size-3 ml-2" />
              </Button>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
          <Badge className="bg-primary/10 text-primary border-primary/20">MEMBER SINCE APRIL 2026</Badge>
          <div className="flex gap-3">
             <Button variant="outline" className="border-white/10 bg-white/5 text-white" onClick={onClose}>
               Close Profile
             </Button>
             <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold">
               Send Feedback Message
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
