import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, User, Dumbbell, Save, Copy, Trash2, Rocket, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CoachPlanBuilder() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
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
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase italic">Plan Architect</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Design workout templates and assign them to your athletes.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 font-bold" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            {view === 'grid' ? <List className="size-4" /> : <LayoutGrid className="size-4" />}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-8">
            <Plus className="size-5 mr-2" />
            Build New Plan
          </Button>
        </div>
      </div>

      {/* Stats/Quick Actions */}
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
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Quick Search</div>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
               <input className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 text-xs focus:outline-none focus:border-primary/50" placeholder="Search templates..." />
            </div>
         </Card>
      </div>

      <div className="pb-2 text-xs font-black uppercase tracking-widest text-muted-foreground">Master Plan Templates</div>
      
      <div className={cn(
        "grid gap-6",
        view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {templates.map((tpl) => (
          <Card key={tpl.id} className="glass border-white/5 group hover:border-primary/40 transition-all overflow-hidden rounded-3xl">
            <div className={cn(
              "p-6 flex items-center justify-between",
              view === 'list' && "px-10"
            )}>
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
                 <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Members</div>
                    <div className="text-sm font-bold text-white flex items-center justify-end gap-2">
                       <User className="size-3 text-primary" /> {tpl.users}
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="size-10 bg-white/5 border border-white/5 hover:text-white transition-all rounded-xl">
                       <Copy className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-10 bg-white/5 border border-white/5 hover:text-rose-400 transition-all rounded-xl">
                       <Trash2 className="size-4" />
                    </Button>
                    <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-6 font-black uppercase text-[10px] rounded-xl transition-all">
                       Edit
                    </Button>
                 </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-primary/5 mt-10 p-10 border border-dashed border-primary/20 rounded-[40px] text-center space-y-4">
         <Rocket className="size-12 text-primary mx-auto mb-4 animate-bounce" />
         <h3 className="text-2xl font-black text-white uppercase italic">Unlock Systemic Coaching</h3>
         <p className="max-w-md mx-auto text-sm font-medium text-muted-foreground">
           Templates allow you to rapidly assign AI-verified programs to entire groups of athletes while maintaining the ability to override individual parameters.
         </p>
         <Button className="bg-primary hover:bg-primary/90 mt-4 px-10 font-bold shadow-2xl shadow-primary/30">Connect Athletes</Button>
      </div>
    </div>
  );
}
