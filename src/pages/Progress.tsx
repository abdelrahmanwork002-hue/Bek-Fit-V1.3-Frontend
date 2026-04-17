import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar as CalendarIcon, TrendingUp, Scale, Award, ArrowUpRight, ArrowDownRight, Plus, Download, ChevronRight, Activity, Utensils } from 'lucide-react';
import { WeightLogModal } from '@/components/log-modals/WeightLogModal';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const weightData = [
  { date: 'Apr 01', weight: 82.5 },
  { date: 'Apr 05', weight: 81.8 },
  { date: 'Apr 10', weight: 82.0 },
  { date: 'Apr 12', weight: 81.2 },
  { date: 'Apr 15', weight: 80.9 },
  { date: 'Apr 18', weight: 80.5 },
];

export function Progress() {
  const { t } = useLanguage();
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Weight,Status\n"
      + weightData.map(e => `${e.date},${e.weight},Logged`).join("\n");
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
          { label: 'Current Weight', value: '80.5 kg', trend: '-2.0kg', positive: true, icon: Scale, color: 'text-blue-400' },
          { label: 'Workout Streak', value: '12 Days', trend: 'New Record!', positive: true, icon: Award, color: 'text-amber-400' },
          { label: 'Adherence', value: '94%', trend: '+4%', positive: true, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Next Milestone', value: '78.0 kg', trend: '2.5kg to go', positive: false, icon: CalendarIcon, color: 'text-primary' },
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
        <Card className="glass border-white/5 p-8 animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <CalendarIcon className="size-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Daily Performance Log</h2>
                <p className="text-sm text-muted-foreground">Details for April {selectedDay + 1}, 2026</p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">98% Adherence</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="size-3" /> Training Log
              </h3>
              {[
                { name: 'Neck Rotations', status: 'Completed', detail: '1 x 60s' },
                { name: 'Cat-Cow Stretch', status: 'Completed', detail: '2 x 15 reps' },
                { name: 'Scapula Pushups', status: 'Skipped', detail: 'Traps felt tight' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="font-medium text-white">{log.name}</span>
                  <div className="text-right">
                    <div className={cn("text-xs font-bold", log.status === 'Completed' ? "text-emerald-400" : "text-amber-400")}>{log.status}</div>
                    <div className="text-[10px] text-muted-foreground">{log.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Utensils className="size-3" /> Nutrition Log
              </h3>
              {[
                { name: 'Breakfast', status: 'Logged', detail: 'Avocado Toast' },
                { name: 'Lunch', status: 'Logged', detail: 'Chicken Quinoa' },
                { name: 'Dinner', status: 'Pending', detail: 'Planned: Salmon' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="font-medium text-white">{log.name}</span>
                  <div className="text-right">
                    <div className={cn("text-xs font-bold", log.status === 'Logged' ? "text-blue-400" : "text-muted-foreground")}>{log.status}</div>
                    <div className="text-[10px] text-muted-foreground">{log.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <WeightLogModal 
        isOpen={isWeightModalOpen} 
        onClose={() => setIsWeightModalOpen(false)} 
        onSuccess={() => console.log('Weight logged!')}
      />
    </div>
  );
}
