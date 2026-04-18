import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">System Nexus</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Platform-wide intelligence and member adherence metrics.</p>
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

        {/* Global System Alerts */}
        <div className="flex flex-col gap-6">
           <Card className="glass border-white/5 p-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Shield Alerts</h3>
                <AlertCircle className="size-5 text-orange-400" />
              </div>
              <div className="space-y-4">
                {[
                  { title: 'High Latency', node: 'EU-WEST-1', severity: 'Medium' },
                  { title: 'Auth Burst', node: 'CLERK-IO', severity: 'Low' },
                ].map((alert, i) => (
                  <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
                    <div>
                      <div className="text-xs font-bold text-white">{alert.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{alert.node}</div>
                    </div>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase",
                      alert.severity === 'Medium' ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
                    )}>{alert.severity}</Badge>
                  </div>
                ))}
              </div>
           </Card>

           <Card className="bg-primary hover:bg-primary/90 transition-all p-8 group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-110">
                 <ShieldCheck className="size-20 text-white" />
              </div>
              <div className="relative z-10">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Security Audit</h3>
                 <p className="text-xs text-white/70 mt-1 max-w-[200px]">Perform a platform-wide deep scan of all AI-generated routines.</p>
                 <Button className="mt-6 bg-black/20 hover:bg-black/40 text-white border border-white/20 text-[10px] font-black uppercase tracking-widest">Run Scan</Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
