import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, Flame, Info, ChevronRight, Zap, Target, TrendingUp, Lightbulb, RefreshCw, X, Search } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useUser } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import { NutritionLogModal } from '@/components/log-modals/NutritionLogModal';
import { PainLogModal } from '@/components/log-modals/PainLogModal';
import { WeightLogModal } from '@/components/log-modals/WeightLogModal';
import { ExerciseLogModal } from '@/components/log-modals/ExerciseLogModal';
import { logService } from '@/services/logService';

export function Dashboard() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isPainOpen, setIsPainOpen] = useState(false);
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [isExExploreOpen, setIsExExploreOpen] = useState(false);
  const [exSearchQuery, setExSearchQuery] = useState('');

  const [workout, setWorkout] = useState([
    { 
      id: 'ex1',
      name: 'Neck Rotations', 
      duration: '60s', 
      type: 'Mobility', 
      completed: true, 
      target: 'Neck, Traps',
      rpe: 2, 
      rest: '0s', 
      sets: 1, 
      reps: '1 min',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=100&q=80'
    },
    { 
      id: 'ex2',
      name: 'Cat-Cow Stretch', 
      reps: '15 reps', 
      type: 'Yoga', 
      completed: true, 
      target: 'Spine, Core',
      rpe: 3, 
      rest: '30s', 
      sets: 2, 
      thumbnail: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=100&q=80'
    },
    { 
      id: 'ex3',
      name: 'Scapula Pushups', 
      reps: '10 reps', 
      type: 'Calisthenics', 
      completed: false, 
      target: 'Scapula, Shoulders',
      rpe: 5, 
      rest: '60s', 
      sets: 3, 
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=100&q=80'
    },
    { 
      id: 'ex4',
      name: 'Squat ISO Hold', 
      duration: '45s', 
      type: 'Strength', 
      completed: false, 
      target: 'Quads, Glutes',
      rpe: 7, 
      rest: '90s', 
      sets: 3, 
      reps: '45s',
      thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&w=100&q=80'
    },
  ]);

  const exerciseLibrary = [
    { id: 'lib1', name: 'Scapula Pullups', type: 'Calisthenics', target: 'Scapula, Back', sets: 3, reps: '10 reps', rpe: 6, rest: '60s', thumbnail: 'https://images.unsplash.com/photo-1598971639058-aba7c52e9c73?auto=format&fit=crop&w=100&q=80' },
    { id: 'lib2', name: 'Wall Slides', type: 'Mobility', target: 'Shoulders, Posture', sets: 2, reps: '12 reps', rpe: 2, rest: '30s', thumbnail: 'https://images.unsplash.com/photo-1514516369414-78177d40e990?auto=format&fit=crop&w=100&q=80' },
    { id: 'lib3', name: 'Plank Hold', type: 'Core', target: 'Abs, Stability', sets: 3, reps: '45s', rpe: 5, rest: '45s', thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=100&q=80' },
    { id: 'lib4', name: 'Dead Bug', type: 'Core', target: 'Deep Core', sets: 3, reps: '12 reps', rpe: 3, rest: '45s', thumbnail: 'https://images.unsplash.com/photo-1517433662323-146316ec711d?auto=format&fit=crop&w=100&q=80' },
  ];

  const handleExerciseSwap = (newEx: any) => {
    if (activeExercise) {
      setWorkout(prev => prev.map((ex, i) => 
        i === activeExercise.idx ? { ...newEx, completed: false } : ex
      ));
      setActiveExercise(null);
      setIsExExploreOpen(false);
    }
  };

  const handleLogNutrition = async (name: string, macros: any) => {
    try {
      await logService.saveNutritionLog({
        ...macros,
        name,
        timestamp: new Date().toISOString()
      });
      setIsNutritionOpen(false);
    } catch (error) {
      console.error('Failed to log nutrition:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in transition-all duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {t('welcome')}, {user?.firstName || 'Back'}
          </h1>
          <p className="text-muted-foreground mt-1">You've hit your goals for 4 days in a row. Keep the streak alive!</p>
        </div>
        <div className="flex gap-4">
          <Card className="bg-primary/5 border-primary/20 px-6 py-3 flex items-center gap-4">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Flame className="size-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold">12 Days</div>
              <div className="text-[10px] text-primary uppercase font-bold tracking-widest">{t('streak')}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: 'Weekly Goal', value: '85%', color: 'text-primary' },
          { icon: Zap, label: 'Sessions', value: '4/6', color: 'text-amber-400' },
          { icon: TrendingUp, label: 'Mobility Index', value: '+12%', color: 'text-emerald-400' },
          { icon: CheckCircle2, label: 'Logs Sync', value: 'Live', color: 'text-blue-400' },
        ].map((metric, i) => (
          <Card key={i} className="glass p-4 border-white/5 flex items-center gap-4">
            <div className={cn("size-10 rounded-lg bg-white/5 flex items-center justify-center", metric.color)}>
              <metric.icon className="size-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{metric.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-medium">{metric.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Daily Vitality Progress (SRS Requirement) */}
      <Card className="glass p-6 border-white/5 bg-gradient-to-r from-primary/5 to-emerald-500/5">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Daily Vitality Goals</h3>
              <Badge variant="outline" className="text-primary border-primary/20">82% Complete</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Calories', current: 1640, goal: 2000, color: 'bg-primary' },
                { label: 'Protein', current: 82, goal: 120, color: 'bg-emerald-400' },
                { label: 'Carbs', current: 180, goal: 250, color: 'bg-amber-400' },
                { label: 'Fats', current: 45, goal: 65, color: 'bg-blue-400' },
              ].map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{m.label}</span>
                    <span className="text-white">{Math.round((m.current / m.goal) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", m.color)} style={{ width: `${(m.current / m.goal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button 
            className="w-full md:w-auto bg-primary/20 hover:bg-primary text-white border border-primary/30"
            onClick={() => setIsNutritionOpen(true)}
          >
            Log Meal
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Workout Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass border-primary/20 overflow-hidden group">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="size-5 text-primary" />
                  <CardTitle>{t('routine')}</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="hidden md:flex bg-white/5 border-white/10 text-xs" onClick={() => setIsExExploreOpen(true)}>
                    <RefreshCw className="size-3 mr-2" /> Substitution Library
                  </Button>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
                    5 Min Session
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {workout.map((ex, idx) => (
                <div key={idx} className="flex flex-col p-6 border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                      <div className="size-16 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group/img">
                        <img src={ex.thumbnail} alt={ex.name} className="size-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity" />
                        {ex.completed && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                            <CheckCircle2 className="size-8 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xl text-white">{ex.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] py-0 border-white/10 uppercase">{ex.type}</Badge>
                          <span className="size-1 rounded-full bg-white/20" />
                          <span className="font-medium text-primary/80">{ex.target}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ex.completed ? (
                        <span className="text-[10px] font-black tracking-tighter text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20 uppercase">Completed</span>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold transition-all px-3"
                            onClick={() => { setActiveExercise({ ...ex, idx }); setIsExExploreOpen(true); }}
                          >
                           <RefreshCw className="size-3 mr-1.5" /> Swap
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white bg-primary/20 hover:bg-primary hover:text-white transition-all rounded-lg font-bold px-4"
                            onClick={() => setActiveExercise({ ...ex, idx })}
                          >
                            Log
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Detailed Stats Grid */}
                  <div className="grid grid-cols-4 gap-4 pl-22">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sets & Reps</div>
                      <div className="text-sm font-bold text-white">{ex.sets} × {ex.reps || ex.duration}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target RPE</div>
                      <div className="text-sm font-bold text-amber-400">RPE {ex.rpe}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rest Period</div>
                      <div className="text-sm font-bold text-blue-400">{ex.rest}</div>
                    </div>
                    <div className="flex items-end justify-end">
                      <Info className="size-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-6 bg-primary/5 text-center">
                <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Finish Workout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass p-6 space-y-4 relative group">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Calories</h3>
                <span className="text-xl font-bold text-white">1,640 <span className="text-xs text-muted-foreground">/ 2000</span></span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '82%' }} />
              </div>
              <Button 
                onClick={() => setIsNutritionOpen(true)}
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 z-10"
              >
                Log
              </Button>
            </Card>
            <Card className="glass p-6 space-y-4 relative group">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Protein</h3>
                <span className="text-xl font-bold text-white">82g <span className="text-xs text-muted-foreground">/ 120g</span></span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: '68%' }} />
              </div>
              <Button 
                onClick={() => setIsNutritionOpen(true)}
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 z-10"
              >
                Log
              </Button>
            </Card>
          </div>

          {/* Weekly Overview */}
          <Card className="glass p-6 border-white/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <CardTitle className="text-xl">Weekly Overview</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Activity over the last 7 days</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsWeightOpen(true)}
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] uppercase font-bold tracking-widest border-white/10"
                >
                  Log Weight
                </Button>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-32 gap-2 mt-4 px-2">
              {[
                { day: 'M', value: '45%' },
                { day: 'T', value: '70%' },
                { day: 'W', value: '30%' },
                { day: 'T', value: '85%' },
                { day: 'F', value: '60%' },
                { day: 'S', value: '95%' },
                { day: 'S', value: '40%' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                  <div className="w-full relative flex flex-col justify-end h-full">
                    <div 
                      className="w-full bg-primary/20 rounded-t-md group-hover:bg-primary/40 transition-colors cursor-pointer" 
                      style={{ height: bar.value }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold">{bar.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/20 to-emerald-400/20 border-primary/20 relative overflow-hidden group">
            <CardHeader>
              <div className="size-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                <Lightbulb className="size-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Tip of the Day</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-300">
                Set a "Standing Desk" alarm every 45 minutes to reset your scapula and prevent trap tension.
              </p>
              <Button variant="link" className="text-primary p-0 mt-4 group-hover:pl-2 transition-all">
                Read full article <ChevronRight className="size-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Upcoming</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setIsPainOpen(true)}>
                <div className="size-10 rounded-xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center group-hover:bg-orange-400/20 transition-colors">
                  <Flame className="size-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">Log Recovery</div>
                  <div className="text-xs text-muted-foreground">Feeling pain? Update status.</div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
                  <Info className="size-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">New Nutrition Tip</div>
                  <div className="text-xs text-muted-foreground">"Benefits of Keto" available</div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Exercise Substitution Modal (Story 13 & 16) */}
      {isExExploreOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Exercise Library</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeExercise ? `Replacing "${activeExercise.name}" with a better matching movement.` : 'Browse the full movement catalog.'}
                  </p>
                </div>
                <button onClick={() => setIsExExploreOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                  <X className="size-6 text-white" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search exercises, targets, or types..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={exSearchQuery}
                  onChange={(e) => setExSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {exerciseLibrary.filter(ex => ex.name.toLowerCase().includes(exSearchQuery.toLowerCase()) || ex.target.toLowerCase().includes(exSearchQuery.toLowerCase())).map((ex) => (
                <div key={ex.id} className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer">
                   <div className="flex items-center gap-6">
                      <div className="size-16 rounded-xl overflow-hidden border border-white/10">
                        <img src={ex.thumbnail} className="size-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-primary mb-1">{ex.type}</div>
                        <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{ex.name}</h4>
                        <p className="text-xs text-muted-foreground">Target: {ex.target}</p>
                      </div>
                   </div>
                   <Button onClick={() => handleExerciseSwap(ex)} className="opacity-0 group-hover:opacity-100 bg-primary text-white font-bold">
                     Swap
                   </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ExerciseLogModal 
        exercise={activeExercise} 
        isOpen={!!activeExercise && !isExExploreOpen} 
        onClose={() => setActiveExercise(null)}
        onSwap={() => setIsExExploreOpen(true)}
        onSave={async (logs) => {
          try {
            await logService.saveExerciseLog({
              exerciseId: activeExercise.id,
              sets: logs,
              timestamp: new Date().toISOString()
            });
            setWorkout(prev => prev.map((ex, i) => 
              i === activeExercise.idx ? { ...ex, completed: true } : ex
            ));
          } catch (error) {
            console.error('Failed to save exercise log:', error);
          }
        }}
      />
      <NutritionLogModal 
        isOpen={isNutritionOpen} 
        onClose={() => setIsNutritionOpen(false)} 
        onSuccess={() => {
          setIsNutritionOpen(false);
          // Optional: refresh data or show toast
        }}
      />
      <PainLogModal isOpen={isPainOpen} onClose={() => setIsPainOpen(false)} />
      <WeightLogModal isOpen={isWeightOpen} onClose={() => setIsWeightOpen(false)} />
    </div>
  );
}
