import React, { useState, useEffect } from 'react';
import { X, Loader2, Play, Pause, RotateCcw, Save, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SetLog {
  reps: number;
  weight: number;
  rpe: number;
  completed: boolean;
}

interface ExerciseLogModalProps {
  exercise: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (logs: SetLog[]) => void;
}

export function ExerciseLogModal({ exercise, isOpen, onClose, onSave }: ExerciseLogModalProps) {
  const [sets, setSets] = useState<SetLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [holdTimer, setHoldTimer] = useState(0);
  const [isHoldActive, setIsHoldActive] = useState(false);

  useEffect(() => {
    if (isOpen && exercise) {
      const plannedSets = Array.from({ length: exercise.sets || 3 }).map(() => ({
        reps: parseInt(exercise.reps) || 12,
        weight: 0,
        rpe: exercise.rpe || 7,
        completed: false
      }));
      setSets(plannedSets);
      setHoldTimer(parseInt(exercise.duration) || 0);
    }
  }, [isOpen, exercise]);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    let interval: any;
    if (isHoldActive && holdTimer > 0) {
      interval = setInterval(() => setHoldTimer(t => t - 1), 1000);
    } else if (holdTimer === 0 && isHoldActive) {
      setIsHoldActive(false);
      // Play a subtle notification sound or vibrate if possible
    }
    return () => clearInterval(interval);
  }, [isHoldActive, holdTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (idx: number) => {
    setSets(prev => prev.map((s, i) => i === idx ? { ...s, completed: !s.completed } : s));
    if (!sets[idx].completed) {
      setTimer(0);
      setIsTimerRunning(true);
    }
  };

  const skipSet = (idx: number) => {
    setSets(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSet = (idx: number, updates: Partial<SetLog>) => {
    setSets(prev => prev.map((s, i) => i === idx ? { ...s, ...updates } : s));
  };

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-xl border border-white/10 overflow-hidden bg-white/5">
              <img src={exercise.thumbnail} className="size-full object-cover opacity-80" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{exercise.name}</h2>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px]">{exercise.type}</Badge>
                <Badge variant="outline" className="border-white/10 text-[10px] text-muted-foreground">{exercise.target}</Badge>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Action Row: Hold Timer & Rest Timer */}
          <div className="grid grid-cols-2 gap-4">
            {/* Hold Timer (New SRS Feature) */}
            <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Position Hold</div>
                <div className="text-2xl font-mono font-bold text-white">{holdTimer}s</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                onClick={() => setIsHoldActive(!isHoldActive)}
              >
                {isHoldActive ? <Pause className="size-4" /> : <Play className="size-4" />}
              </Button>
            </div>

            {/* Rest Timer */}
            <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Rest Timer</div>
                <div className="text-2xl font-mono font-bold text-white">{formatTime(timer)}</div>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-500/10 border-blue-500/20 text-blue-400 px-2"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/5 border-white/10 px-2"
                  onClick={() => setTimer(0)}
                >
                  <RotateCcw className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Logging Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <div className="col-span-1">Set</div>
              <div className="col-span-3">Weight</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-3">RPE</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            {sets.map((set, idx) => (
              <div 
                key={idx} 
                className={`grid grid-cols-12 gap-4 items-center p-3 rounded-xl border transition-all ${
                  set.completed ? 'bg-primary/5 border-primary/20 opacity-60' : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="col-span-1 font-bold text-muted-foreground">{idx + 1}</div>
                
                <div className="col-span-3">
                  <input
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(idx, { weight: parseFloat(e.target.value) })}
                    placeholder="kg"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-center focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div className="col-span-3">
                  <input
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(idx, { reps: parseInt(e.target.value) })}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-center focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div className="col-span-3 flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={set.rpe}
                    onChange={(e) => updateSet(idx, { rpe: parseInt(e.target.value) })}
                    className="flex-1 accent-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-amber-400 w-3">{set.rpe}</span>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => skipSet(idx)}
                    className="size-8 rounded-lg flex items-center justify-center border border-white/5 bg-white/5 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Skip Set"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <button
                    onClick={() => handleToggleSet(idx)}
                    className={`size-8 rounded-lg flex items-center justify-center border transition-all ${
                      set.completed 
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <Save className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            className="w-full border-dashed border-white/10 bg-transparent text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl"
            onClick={() => setSets([...sets, { reps: 0, weight: 0, rpe: 7, completed: false }])}
          >
            <Plus className="size-4 mr-2" /> Add Set
          </Button>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-4">
          <Button variant="outline" className="flex-1 bg-transparent border-white/10 rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 rounded-xl"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await onSave(sets);
              setLoading(false);
              onClose();
            }}
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            Finish Exercise
          </Button>
        </div>
      </div>
    </div>
  );
}
