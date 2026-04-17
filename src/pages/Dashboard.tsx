import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, Flame, Info, ChevronRight, Zap, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useUser } from '@clerk/clerk-react';
import { cn } from '@/lib/utils';
import { NutritionLogModal } from '@/components/logs/NutritionLogModal';
import { PainLogModal } from '@/components/logs/PainLogModal';
import { WeightLogModal } from '@/components/logs/WeightLogModal';
import { useState } from 'react';

export function Dashboard() {
  const { t } = useLanguage();
  const { user } = useUser();
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isPainOpen, setIsPainOpen] = useState(false);
  const [isWeightOpen, setIsWeightOpen] = useState(false);

  const workout = [
    { name: 'Neck Rotations', duration: '60s', type: 'Mobility', completed: true },
    { name: 'Cat-Cow Stretch', reps: '15 reps', type: 'Yoga', completed: true },
    { name: 'Scapula Pushups', reps: '10 reps', type: 'Calisthenics', completed: false },
    { name: 'Squat ISO Hold', duration: '45s', type: 'Strength', completed: false },
  ];

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
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  5 Min Session
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {workout.map((ex, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative">
                      {ex.completed ? (
                        <CheckCircle2 className="size-6 text-primary" />
                      ) : (
                        <Play className="size-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{ex.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{ex.type}</span>
                        <span className="size-1 rounded-full bg-white/20" />
                        <span>{ex.duration || ex.reps}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {ex.completed ? (
                      <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">Logged</span>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-white"
                        onClick={() => {
                          const updated = [...workout];
                          updated[idx].completed = true;
                          // In a real app, this would call the API
                        }}
                      >
                        Log
                      </Button>
                    )}
                    <Info className="size-5 text-white/20 hover:text-white transition-colors cursor-pointer" />
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

          {/* Nutrition Summary (Story 7) */}
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
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
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
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
              >
                Log
              </Button>
            </Card>
          </div>

          {/* Weekly Overview (Mock Chart) */}
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
          {/* Tip of the Day (Story 18) */}
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

          {/* Quick Stats */}
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

      {/* Modals */}
      <NutritionLogModal 
        isOpen={isNutritionOpen} 
        onClose={() => setIsNutritionOpen(false)} 
      />
      <PainLogModal 
        isOpen={isPainOpen} 
        onClose={() => setIsPainOpen(false)} 
      />
      <WeightLogModal 
        isOpen={isWeightOpen} 
        onClose={() => setIsWeightOpen(false)} 
      />
    </div>
  );
}

function Lightbulb(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2.2 1.5 3.1.7.7 1.3 1.5 1.5 2.4" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}
