import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Dumbbell, Calendar, SlidersHorizontal, TrendingUp } from 'lucide-react';

interface AthletePulseModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
  onAdjust: () => void;
}

export function AthletePulseModal({ isOpen, onClose, athleteId, athleteName, onAdjust }: AthletePulseModalProps) {
  const { data: routines = [], isLoading } = useQuery({
    queryKey: ['athlete-routines-pulse', athleteId],
    queryFn: async () => {
      const { data } = await api.get(`/api/routines/user/${athleteId}`);
      return data;
    },
    enabled: !!athleteId && isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0F1115] border-white/10 text-white rounded-[32px] max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
             <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="size-6" />
             </div>
             <div>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Live Session Scan</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                   <p className="text-xs text-muted-foreground uppercase font-black">{athleteName}</p>
                   <div className="size-1 rounded-full bg-primary" />
                   <span className="text-[10px] text-primary font-black uppercase">Real-time Stream</span>
                </div>
             </div>
          </div>
          <Button 
            className="bg-primary/20 text-primary border border-primary/20 hover:bg-primary hover:text-white font-black uppercase text-[10px] px-6 rounded-xl transition-all"
            onClick={onAdjust}
          >
             <SlidersHorizontal className="size-3 mr-2" /> Adjust Plan
          </Button>
        </DialogHeader>

        <div className="py-8 space-y-6">
           {isLoading ? (
             <div className="py-20 text-center animate-pulse text-muted-foreground uppercase font-black tracking-widest text-[10px]">Synchronizing Pulse...</div>
           ) : (
             <>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                      <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Weekly Adherence</div>
                      <div className="text-xl font-black text-white">92.4%</div>
                   </div>
                   <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                      <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Vitality Score</div>
                      <div className="text-xl font-black text-emerald-400">Elite</div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Protocol Status</h3>
                   {routines.slice(0, 1).map((routine: any) => (
                      <div key={routine.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                               <Calendar className="size-4 text-primary" />
                               <span className="text-xs font-bold text-white">{new Date(routine.scheduledDate).toLocaleDateString()}</span>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none">{routine.status}</Badge>
                         </div>

                         <div className="space-y-3">
                            {routine.exercises.slice(0, 3).map((ex: any) => (
                               <div key={ex.routine_exercises.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                  <div className="flex items-center gap-3">
                                     <Dumbbell className="size-3 text-muted-foreground" />
                                     <span className="text-xs text-white/80">{ex.exercises.title}</span>
                                  </div>
                                  <div className="text-[10px] font-black text-primary uppercase">
                                     {ex.routine_exercises.sets}x{ex.routine_exercises.reps}
                                  </div>
                               </div>
                            ))}
                            {routine.exercises.length > 3 && (
                               <div className="text-[9px] text-muted-foreground italic text-center pt-2">+ {routine.exercises.length - 3} more exercises in protocol</div>
                            )}
                         </div>
                      </div>
                   ))}
                   {routines.length === 0 && (
                      <div className="p-10 text-center border border-dashed border-white/5 rounded-3xl text-sm text-muted-foreground">
                         No active protocol detected for this scanning window.
                      </div>
                   )}
                </div>
             </>
           )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/5">
           <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-400" />
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Growth Trend: +4.2%</span>
           </div>
           <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold border border-white/5 h-10 px-6">Close Scan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
