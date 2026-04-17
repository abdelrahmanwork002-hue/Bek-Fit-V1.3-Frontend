import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar as CalendarIcon, TrendingUp, Scale, Award, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { WeightLogModal } from '@/components/log-modals/WeightLogModal';
import { useLanguage } from '@/lib/i18n';

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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Fitness Analytics</h1>
          <p className="text-muted-foreground mt-1">Visualize your journey and adherence performance.</p>
        </div>
        <Button 
          onClick={() => setIsWeightModalOpen(true)}
          className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="size-4 mr-2" /> Log Measurement
        </Button>
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
        {/* Weight Chart */}
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

        {/* Consistency Calendar (Mock Heatmap) */}
        <Card className="glass border-white/5 p-6">
          <CardHeader className="p-0 mb-8">
            <CardTitle>Activity Heatmap</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Your consistency over the last 4 weeks</p>
          </CardHeader>
          <div className="grid grid-cols-7 gap-2">
            {['M','T','W','T','F','S','S'].map(d => (
              <div key={d} className="text-[10px] font-bold text-center text-muted-foreground mb-2">{d}</div>
            ))}
            {Array.from({ length: 28 }).map((_, i) => {
              const status = Math.random() > 0.3 ? (Math.random() > 0.2 ? 'done' : 'missed') : 'future';
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-sm transition-all duration-300 ${
                    status === 'done' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 
                    status === 'missed' ? 'bg-primary/20' : 
                    'bg-white/5'
                  }`}
                  title={status === 'done' ? 'Workout Completed' : status === 'missed' ? 'Rest/Missed' : 'Upcoming'}
                />
              );
            })}
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

      <WeightLogModal 
        isOpen={isWeightModalOpen} 
        onClose={() => setIsWeightModalOpen(false)} 
        onSuccess={() => console.log('Weight logged!')}
      />
    </div>
  );
}
