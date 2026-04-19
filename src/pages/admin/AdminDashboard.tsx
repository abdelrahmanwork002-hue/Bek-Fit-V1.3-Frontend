import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Activity, Bot, TrendingUp, Calendar, AlertCircle, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

const engagementData = [
  { time: '00:00', users: 1200 },
  { time: '04:00', users: 400 },
  { time: '08:00', users: 4500 },
  { time: '12:00', users: 6200 },
  { time: '16:00', users: 5800 },
  { time: '20:00', users: 8400 },
  { time: '23:59', users: 3100 },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">Coach Command Center</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Monitoring member biomechanics, adherence, and platform vitality.</p>
        </div>
        <div className="flex gap-3">
           <Card className="bg-primary/5 border-primary/20 px-4 py-2 flex items-center gap-3">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Edge Nodes Online</span>
           </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Active Champions', value: '47,201', trend: '+12%', up: true },
          { icon: Activity, label: 'Routine Syncs', value: '1,420,114', trend: '+8%', up: true },
          { icon: Bot, label: 'AI Accuracy', value: '99.4%', trend: '-0.2%', up: false },
          { icon: TrendingUp, label: 'Retention Rate', value: '82%', trend: '+4%', up: true },
        ].map((stat, i) => (
          <Card key={i} className="glass border-white/5 relative overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                <stat.icon className="size-4 text-primary" />
              </div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold mt-2",
                stat.up ? "text-emerald-400" : "text-rose-400"
              )}>
                {stat.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {stat.trend} <span className="text-muted-foreground font-normal ml-1">vs last month</span>
              </div>
            </div>
            <div className={cn(
               "absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-all duration-700",
               "opacity-0 group-hover:opacity-100"
            )} />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Analytics */}
        <Card className="lg:col-span-2 glass border-white/5 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">Platform Engagement</h3>
              <p className="text-xs text-muted-foreground mt-1">Live user traffic analyzed by time-segment.</p>
            </div>
            <Badge variant="outline" className="border-white/10 uppercase text-[9px] font-bold">24H Window</Badge>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4fb6b2" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4fb6b2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#4fb6b2' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#4fb6b2" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
         <Card className="glass border-white/5 p-8">
            <h3 className="text-xl font-bold text-white uppercase italic mb-6">Weekly Adherence Distribution</h3>
            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Mon', completion: 92 },
                    { name: 'Tue', completion: 88 },
                    { name: 'Wed', completion: 95 },
                    { name: 'Thu', completion: 45 },
                    { name: 'Fri', completion: 78 },
                    { name: 'Sat', completion: 91 },
                    { name: 'Sun', completion: 93 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    />
                    <Bar dataKey="completion" fill="#4fb6b2" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 italic text-center">
              Coaching Insight: Adherence drops significantly on Thursdays. Consider AI adjustment for mid-week load.
            </p>
         </Card>

         <Card className="glass border-white/5 p-8">
            <h3 className="text-xl font-bold text-white uppercase italic mb-6">Top Biomechanical Risks</h3>
            <div className="space-y-6">
               {[
                 { name: 'Shoulder Impingement', count: 124, trend: 'Increasing' },
                 { name: 'Lower Back Tension', count: 85, trend: 'Stable' },
                 { name: 'Knee Instability', count: 42, trend: 'Improving' },
               ].map((risk, i) => (
                 <div key={i} className="flex items-center justify-between group">
                    <div>
                       <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{risk.name}</div>
                       <div className="text-[10px] text-muted-foreground uppercase">{risk.count} Members Affected</div>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black uppercase border-none",
                      risk.trend === 'Increasing' ? "text-rose-400" : "text-emerald-400"
                    )}>{risk.trend}</Badge>
                 </div>
               ))}
            </div>
            <Button className="w-full mt-10 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest h-12 rounded-2xl">
              View Detailed Health Map
            </Button>
         </Card>
      </div>
    </div>
  );
}
