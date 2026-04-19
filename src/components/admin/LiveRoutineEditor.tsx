import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Activity, Dumbbell, Save, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface LiveRoutineEditorProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
}

export function LiveRoutineEditor({ isOpen, onClose, athleteId, athleteName }: LiveRoutineEditorProps) {
  const queryClient = useQueryClient();
  
  const { data: routines = [], isLoading } = useQuery({
    queryKey: ['athlete-routines', athleteId],
    queryFn: async () => {
      const { data } = await api.get(`/api/routines/user/${athleteId}`);
      return data;
    },
    enabled: !!athleteId && isOpen
  });

  const updateExercise = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
       await api.patch(`/api/routines/exercise/${id}`, data);
    },
    onSuccess: () => {
       toast.success('Protocol updated');
       queryClient.invalidateQueries({ queryKey: ['athlete-routines'] });
    }
  });

  if (!athleteId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0F1115] border-white/10 text-white rounded-[32px] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase italic tracking-tighter">Live Protocol Adjust: {athleteName}</DialogTitle>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Fine-tune training volume and exercise selection in real-time.</p>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 text-center animate-pulse text-muted-foreground">Syncing athlete routines...</div>
        ) : (
          <div className="space-y-8 mt-8">
             {routines.map((routine: any) => (
                <div key={routine.id} className="space-y-4 border-b border-white/5 pb-8 last:border-0">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Activity className="size-4 text-primary" />
                         <span className="text-sm font-black uppercase tracking-widest text-white">
                            {new Date(routine.scheduledDate).toLocaleDateString()} Session
                         </span>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20">{routine.status}</Badge>
                   </div>

                   <div className="grid gap-3">
                      {routine.exercises.map((item: any) => (
                         <div key={item.routine_exercises.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                               <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                                  <Dumbbell className="size-5" />
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-white">{item.exercises.title}</div>
                                  <div className="text-[10px] text-muted-foreground">{item.exercises.targetMuscle}</div>
                               </div>
                            </div>

                            <div className="flex items-center gap-2">
                               <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sets</label>
                                  <input 
                                    className="w-12 bg-white/5 border border-white/10 rounded-lg p-1 text-center text-xs text-white" 
                                    defaultValue={item.routine_exercises.sets}
                                    onBlur={(e) => updateExercise.mutate({ id: item.routine_exercises.id, data: { sets: e.target.value } })}
                                  />
                               </div>
                               <div className="flex flex-col gap-1">
                                  <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reps/Dur</label>
                                  <input 
                                    className="w-20 bg-white/5 border border-white/10 rounded-lg p-1 text-center text-xs text-white" 
                                    defaultValue={item.routine_exercises.reps}
                                    onBlur={(e) => updateExercise.mutate({ id: item.routine_exercises.id, data: { reps: e.target.value } })}
                                  />
                               </div>
                               <Button variant="ghost" size="icon" className="size-8 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-primary">
                                  <RefreshCcw className="size-4" />
                               </Button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             ))}

             {routines.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl text-sm text-muted-foreground italic">
                   No active routines found for this athlete. Use AI Pulse to generate one.
                </div>
             )}
          </div>
        )}

        <div className="pt-6 flex justify-end gap-3 border-t border-white/5 bg-[#0F1115] sticky bottom-0">
           <Button variant="ghost" onClick={onClose} className="h-12 px-8 rounded-2xl font-bold border border-white/5">Close</Button>
           <Button className="h-12 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase">Force Update Global Plan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
