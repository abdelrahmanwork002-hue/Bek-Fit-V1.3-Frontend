import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Search, GripVertical, Trash2, Save, ArrowLeft, 
  Dumbbell, Utensils, Calendar, Zap, LayoutPanelLeft, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  title: string;
  targetMuscle: string;
}

interface RoutineItem {
  id: string; // temp id for drafting
  exerciseId: string;
  title: string;
  sets: number;
  reps: string;
}

export default function PlanDesigner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeDay, setActiveDay] = useState(1);
  const [draftRoutines, setDraftRoutines] = useState<Record<number, RoutineItem[]>>({});
  const [search, setSearch] = useState('');

  const { data: exercises = [] } = useQuery<Exercise[]>({
    queryKey: ['exercise-library'],
    queryFn: async () => {
      const { data } = await api.get('/api/exercises');
      return data;
    }
  });

  const addToDay = (ex: Exercise) => {
    const newItem: RoutineItem = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId: ex.id,
      title: ex.title,
      sets: 3,
      reps: '10-12'
    };
    setDraftRoutines(prev => ({
      ...prev,
      [activeDay]: [...(prev[activeDay] || []), newItem]
    }));
  };

  const removeFromDay = (day: number, itemId: string) => {
    setDraftRoutines(prev => ({
      ...prev,
      [day]: prev[day].filter(i => i.id !== itemId)
    }));
  };

  const savePlan = () => {
     toast.success('System Architecture Locked & Deployed');
     navigate('/admin/plans');
  };

  const filteredExercises = exercises.filter(ex => 
    ex.title.toLowerCase().includes(search.toLowerCase()) ||
    ex.targetMuscle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
           <Button variant="ghost" size="icon" onClick={() => navigate('/admin/plans')} className="rounded-full hover:bg-white/5">
              <ArrowLeft className="size-6" />
           </Button>
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase italic text-white leading-none">System Architect</h1>
              <div className="flex items-center gap-2 mt-1">
                 <Badge variant="outline" className="text-primary text-[8px] uppercase tracking-widest border-primary/20">Template ID: {id?.slice(0,8)}</Badge>
              </div>
           </div>
        </div>
        <Button onClick={savePlan} className="bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 px-10 rounded-2xl h-14 font-black uppercase tracking-widest italic">
           <Save className="size-5 mr-3" /> Commit Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Library Selection */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="glass border-white/5 p-6 space-y-6 sticky top-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <LayoutPanelLeft className="size-4" /> Component Library
                 </h2>
              </div>

              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                 <input 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 text-xs focus:outline-none focus:border-primary/50 text-white" 
                    placeholder="Search Movements..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                 {filteredExercises.map(ex => (
                    <div key={ex.id} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-primary/30 transition-all">
                       <div>
                          <div className="text-sm font-bold text-white leading-tight">{ex.title}</div>
                          <div className="text-[10px] text-muted-foreground uppercase mt-1 tracking-widest font-black">{ex.targetMuscle}</div>
                       </div>
                       <Button size="icon" variant="ghost" onClick={() => addToDay(ex)} className="size-8 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="size-4 text-primary" />
                       </Button>
                    </div>
                 ))}
              </div>
           </Card>
        </div>

        {/* Right: Plan Construction */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                 <button 
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
                    activeDay === day ? "bg-primary text-white" : "text-muted-foreground hover:bg-white/5"
                  )}
                 >
                    Day {day}
                 </button>
              ))}
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-3">
                    <Calendar className="size-4 text-primary" /> Workout Protocol: Day {activeDay}
                 </h3>
                 <span className="text-[10px] text-muted-foreground uppercase font-black">{(draftRoutines[activeDay]?.length || 0)} Units Assigned</span>
              </div>

              {draftRoutines[activeDay]?.map((item, idx) => (
                 <div key={item.id} className="bg-[#0F1115] border border-white/10 rounded-3xl p-6 flex items-center gap-6 group hover:border-primary/20 transition-all">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground shrink-0 border border-white/5">
                       <GripVertical className="size-5" />
                    </div>
                    
                    <div className="flex-1">
                       <div className="text-lg font-black text-white italic uppercase tracking-tighter italic">{idx + 1}. {item.title}</div>
                       <div className="flex items-center gap-6 mt-4">
                          <div className="space-y-2">
                             <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sets</label>
                             <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="size-6 bg-white/5 rounded-lg">-</Button>
                                <span className="text-sm font-black text-white w-6 text-center">{item.sets}</span>
                                <Button variant="ghost" size="icon" className="size-6 bg-white/5 rounded-lg">+</Button>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reps / Duration</label>
                             <input 
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none w-24 font-bold" 
                                defaultValue={item.reps}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Rest Interval</label>
                             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                <Clock className="size-3" /> 60s
                             </div>
                          </div>
                       </div>
                    </div>

                    <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => removeFromDay(activeDay, item.id)}
                       className="size-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-muted-foreground"
                    >
                       <Trash2 className="size-5" />
                    </Button>
                 </div>
              ))}

              {(!draftRoutines[activeDay] || draftRoutines[activeDay].length === 0) && (
                 <div className="py-24 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center gap-4">
                    <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground opacity-20">
                       <Zap className="size-8" />
                    </div>
                    <div className="text-center">
                       <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Empty Protocol Slot</p>
                       <p className="text-[10px] text-muted-foreground font-medium mt-1">Select movements from the library to populate this session.</p>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
