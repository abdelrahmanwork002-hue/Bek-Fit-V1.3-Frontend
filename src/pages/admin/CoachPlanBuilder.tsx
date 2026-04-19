import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, User, Dumbbell, Save, Copy, Trash2, Rocket, LayoutGrid, List, Activity, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreatePlanModal } from '@/components/admin/CreatePlanModal';
import { LiveRoutineEditor } from '@/components/admin/LiveRoutineEditor';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockTrackingData = [
  { athlete: 'Alex Rivera', plan: 'Elite Hypertrophy', progress: 85, status: 'On Track', lastActive: '2 min ago' },
  { athlete: 'Sarah Jenkins', plan: 'Mobility Alpha', progress: 42, status: 'Stalled', lastActive: '1 day ago' },
  { athlete: 'Marco Rossi', plan: 'Calisthenics Base', progress: 98, status: 'Elite', lastActive: '1 hour ago' },
  { athlete: 'Lena Park', plan: 'Elite Hypertrophy', progress: 12, status: 'At Risk', lastActive: '3 days ago' },
];

export default function CoachPlanBuilder() {
  const [activeTab, setActiveTab] = useState<'templates' | 'tracking'>('templates');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<{ id: string; name: string } | null>(null);
  
  const templates = [
    { id: '1', name: 'Elite Hypertrophy V4', type: 'Strength', users: 142, duration: '12 Weeks' },
    { id: '2', name: 'Mobility Recovery Alpha', type: 'Recovery', users: 89, duration: '4 Weeks' },
    { id: '3', name: 'Calisthenics Base 101', type: 'Bodyweight', users: 512, duration: '8 Weeks' },
    { id: '4', name: 'Endurance Max', type: 'Cardio', users: 34, duration: '6 Weeks' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase italic">Athlete Program Hub</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Design master protocols and monitor live athlete execution.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white/5 p-1 rounded-2xl border border-white/5 flex gap-1">
             <button 
               onClick={() => setActiveTab('templates')}
               className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'templates' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
             >
               Templates
             </button>
             <button 
               onClick={() => setActiveTab('tracking')}
               className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", activeTab === 'tracking' ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
             >
               Live Tracking
             </button>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-8 rounded-2xl"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="size-5 mr-2" /> Build Plan
          </Button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="bg-emerald-500/10 border-emerald-500/20 p-6 flex items-center justify-between">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Successfully Assigned</div>
                   <div className="text-2xl font-black text-white mt-1">1,204 Users</div>
                </div>
                <Rocket className="size-8 text-emerald-400 opacity-40" />
             </Card>
             <Card className="bg-primary/10 border-primary/20 p-6 flex items-center justify-between">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-primary">Active Templates</div>
                   <div className="text-2xl font-black text-white mt-1">14 Systems</div>
                </div>
                <Dumbbell className="size-8 text-primary opacity-40" />
             </Card>
             <Card className="glass border-white/5 p-6 flex flex-col justify-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Filter Catalog</div>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                   <input className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 text-xs focus:outline-none focus:border-primary/50" placeholder="Search templates..." />
                </div>
             </Card>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/5">
             <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Master Plan Templates</div>
             <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="size-8 hover:bg-white/5" onClick={() => setView('grid')}><LayoutGrid className={cn("size-4", view === 'grid' ? "text-primary" : "text-muted-foreground")} /></Button>
                <Button variant="ghost" size="icon" className="size-8 hover:bg-white/5" onClick={() => setView('list')}><List className={cn("size-4", view === 'list' ? "text-primary" : "text-muted-foreground")} /></Button>
             </div>
          </div>
          
          <div className={cn(
            "grid gap-6",
            view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {templates.map((tpl) => (
              <Card key={tpl.id} className="glass border-white/5 group hover:border-primary/40 transition-all overflow-hidden rounded-3xl">
                <div className={cn("p-6 flex items-center justify-between", view === 'list' && "px-10")}>
                  <div className="flex items-center gap-6">
                     <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-all">
                        <Calendar className="size-6" />
                     </div>
                     <div>
                        <h3 className="font-black text-lg text-white group-hover:text-primary transition-colors tracking-tight uppercase italic">{tpl.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <Badge className="bg-white/5 text-muted-foreground border-none text-[8px] tracking-widest uppercase font-black">{tpl.type}</Badge>
                           <span className="text-[10px] text-muted-foreground font-bold">{tpl.duration} Program</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="size-10 bg-white/5 border border-white/5 hover:text-white transition-all rounded-xl"><Copy className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="size-10 bg-white/5 border border-white/5 hover:text-rose-400 transition-all rounded-xl"><Trash2 className="size-4" /></Button>
                        <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-6 font-black uppercase text-[10px] rounded-xl transition-all">Edit</Button>
                     </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                { label: 'Active Athletes', value: '842', sub: '+12% month', icon: User },
                { label: 'Avg Adherence', value: '78.4%', sub: 'Target: 85%', icon: CheckCircle2 },
                { label: 'Bio-Fails', value: '14', sub: 'Urgent Action', icon: ShieldAlert },
                { label: 'Plan Fatigue', value: '5.2%', sub: 'Low', icon: TrendingUp },
              ].map(stat => (
                <Card key={stat.label} className="glass border-white/5 p-6">
                   <div className="flex items-center justify-between mb-4">
                      <stat.icon className="size-4 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                   </div>
                   <div className="text-2xl font-black text-white">{stat.value}</div>
                   <div className="text-[9px] text-muted-foreground mt-1 uppercase font-bold">{stat.sub}</div>
                </Card>
              ))}
           </div>

           <Card className="glass border-white/5 overflow-hidden rounded-3xl">
              <div className="grid grid-cols-[1fr,1fr,120px,150px,100px] gap-px bg-white/5">
                 <div className="bg-[#0F1115] p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Athlete</div>
                 <div className="bg-[#0F1115] p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Plan</div>
                 <div className="bg-[#0F1115] p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progress</div>
                 <div className="bg-[#0F1115] p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vitality Status</div>
                 <div className="bg-[#0F1115] p-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</div>
                 
                 {mockTrackingData.map((row) => (
                   <React.Fragment key={row.athlete}>
                     <div className="bg-background p-5 flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                           {row.athlete[0]}
                        </div>
                        <div>
                           <div className="text-sm font-bold text-white">{row.athlete}</div>
                           <div className="text-[9px] text-muted-foreground uppercase">{row.lastActive}</div>
                        </div>
                     </div>
                     <div className="bg-background p-5 flex items-center">
                        <Badge variant="outline" className="border-white/10 text-xs font-medium text-muted-foreground">{row.plan}</Badge>
                     </div>
                     <div className="bg-background p-5 flex flex-col justify-center gap-2">
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${row.progress}%` }} />
                        </div>
                        <span className="text-[9px] font-black text-white">{row.progress}%</span>
                     </div>
                     <div className="bg-background p-5 flex items-center">
                        <Badge className={cn(
                          "uppercase text-[9px] font-black tracking-widest px-3",
                          row.status === 'On Track' ? "bg-emerald-500/10 text-emerald-400" :
                          row.status === 'Elite' ? "bg-primary/20 text-primary border border-primary/20" :
                          row.status === 'Stalled' ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                        )}>
                          {row.status}
                        </Badge>
                     </div>
                     <div className="bg-background p-5 flex items-center justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl"
                          onClick={() => setSelectedAthlete({ id: row.athlete, name: row.athlete })}
                        >
                          Adjust
                        </Button>
                     </div>
                   </React.Fragment>
                 ))}
              </div>
           </Card>
        </div>
      )}

      <CreatePlanModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      
      <LiveRoutineEditor
        isOpen={!!selectedAthlete}
        onClose={() => setSelectedAthlete(null)}
        athleteId={selectedAthlete?.id || ''}
        athleteName={selectedAthlete?.name || ''}
      />
    </div>
  );
}
