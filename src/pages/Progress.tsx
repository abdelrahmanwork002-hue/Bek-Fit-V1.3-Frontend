import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar as CalendarIcon, Download, ChevronRight, Activity, CheckCircle2, X, TrendingUp, Scale, Award, ArrowUpRight, ArrowDownRight, Plus, Utensils } from 'lucide-react';
import { WeightLogModal } from '@/components/log-modals/WeightLogModal';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useWeightLogs, useExerciseLogs } from '@/hooks/useLogs';
import { useQueryClient } from '@tanstack/react-query';



export function Progress() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { data: weightData = [] } = useWeightLogs();
  const { data: exerciseLogs = [] } = useExerciseLogs();

  const currentWeight = weightData.length ? weightData[weightData.length - 1]?.weight ?? 0 : 0;
  const firstWeight = weightData.length ? weightData[0]?.weight ?? 0 : 0;
  const weightChange = currentWeight && firstWeight ? (currentWeight - firstWeight).toFixed(1) : '0';

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Weight,Status\n"
      + weightData.map((e: any) => `${e.date},${e.weight},Logged`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bek_fit_progress.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Fitness Analytics</h1>
          <p className="text-muted-foreground mt-1">Visualize your journey and adherence performance.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={exportData}
            className="border-white/10 bg-white/5 text-white"
          >
            <Download className="size-4 mr-2" /> Export CSV
          </Button>
          <Button 
            onClick={() => setIsWeightModalOpen(true)}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Plus className="size-4 mr-2" /> Log Measurement
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current Weight', value: currentWeight ? `${currentWeight} kg` : '— kg', trend: `${weightChange}kg change`, positive: Number(weightChange) <= 0, icon: Scale, color: 'text-blue-400' },
          { label: 'Logged Sessions', value: `${exerciseLogs.length}`, trend: 'total logged', positive: true, icon: Award, color: 'text-amber-400' },
          { label: 'Adherence', value: '94%', trend: '+4%', positive: true, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Next Milestone', value: `${Math.max(0, currentWeight - 2.5).toFixed(1)} kg`, trend: '2.5kg to go', positive: false, icon: CalendarIcon, color: 'text-primary' },
        ].map((stat, i) => (
          <Card key={i} className="glass border-white/5 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className={`text-xs font-bold flex items-center ${stat.positive ? 'text-emerald-400' : 'text-primary'}`}>
                {stat.positive ? <ArrowDownRight className="size-3 mr-1" /> : <ArrowUpRight className="size-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Chart (Story 8.4) */}
        <Card className="lg:col-span-2 glass border-white/5 p-6">
          <CardHeader className="p-0 mb-8">
            <CardTitle>Weight History</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Weight measurements over the last 30 days</p>
          </CardHeader>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Consistency Calendar (Story 8.2) */}
        <Card className="glass border-white/5 p-6">
          <CardHeader className="p-0 mb-8">
            <CardTitle>Activity Heatmap</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Select a day to view detailed logs</p>
          </CardHeader>
          <div className="grid grid-cols-7 gap-2">
            {['M','T','W','T','F','S','S'].map(d => (
              <div key={d} className="text-[10px] font-bold text-center text-muted-foreground mb-2">{d}</div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedDay(i)}
                className={cn(
                  "aspect-square rounded-sm cursor-pointer transition-all duration-300 hover:scale-110",
                  i === selectedDay ? "ring-2 ring-white ring-offset-2 ring-offset-[#0F1115]" : "",
                  i % 4 === 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" : 
                  i % 7 === 0 ? "bg-primary/20" : 
                  "bg-white/5"
                )}
              />
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-sm bg-emerald-500" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <span className="font-bold text-white">22 Sessions</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-sm bg-primary/20" />
                <span className="text-muted-foreground">Rest/Missed</span>
              </div>
              <span className="font-bold text-white">6 Days</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Selected Day Detail (Story 8.3) */}
      {selectedDay !== null && (
        <Card className="glass border-white/5 p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)} className="text-muted-foreground hover:text-white">✕</Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <CalendarIcon className="size-7 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Daily Performance Log</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">April {selectedDay + 1}, 2026</p>
                  <span className="size-1 rounded-full bg-white/20" />
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3">98% Adherence</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none p-4 bg-white/5 rounded-2xl border border-white/5 text-center px-8">
                <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Calories</div>
                <div className="text-xl font-black text-white">1,840</div>
              </div>
              <div className="flex-1 md:flex-none p-4 bg-white/5 rounded-2xl border border-white/5 text-center px-8">
                <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Protein</div>
                <div className="text-xl font-black text-emerald-400">114g</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Workout Detail Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                  <Activity className="size-4 text-primary" /> Workout Summary
                </h3>
                <span className="text-[10px] font-bold text-primary">55 MIN DURATION</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Neck Rotations', status: 'Completed', detail: '1x60s • 2 RPE', icon: CheckCircle2 },
                  { name: 'Cat-Cow Stretch', status: 'Completed', detail: '2x15 • 3 RPE', icon: CheckCircle2 },
                  { name: 'Scapula Pushups', status: 'Skipped', detail: 'Traps tight', icon: X },
                  { name: 'Squat ISO Hold', status: 'Completed', detail: '3x45s • 8 RPE', icon: CheckCircle2 },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "size-8 rounded-full flex items-center justify-center border",
                        log.status === 'Completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      )}>
                        <log.icon className="size-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{log.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{log.detail}</div>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-white/5 group-hover:text-white/20 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Detail Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-3">
                  <Utensils className="size-4 text-emerald-400" /> Nutrition Log
                </h3>
                <span className="text-[10px] font-bold text-emerald-400">VITALLY ADHERENT</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Breakfast', status: 'Logged', detail: 'Avocado Toast & Eggs', cal: 450 },
                  { name: 'Lunch', status: 'Logged', detail: 'Grilled Chicken Salad', cal: 580 },
                  { name: 'Dinner', status: 'Logged', detail: 'Baked Salmon & Greens', cal: 610 },
                  { name: 'Snacks', status: 'Logged', detail: 'Greek Yogurt & Nuts', cal: 200 },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="size-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Utensils className="size-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{log.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{log.detail}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">{log.cal}</div>
                      <div className="text-[8px] text-muted-foreground font-medium uppercase tracking-widest text-emerald-400">kcal</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <WeightLogModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['logs-weight'] })}
      />
    </div>
  );
}
