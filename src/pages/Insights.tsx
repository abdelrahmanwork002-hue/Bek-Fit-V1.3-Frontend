import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, ShieldAlert, TrendingUp, Zap, ChevronRight, BarChart3, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { cn } from '@/lib/utils';
import { useExerciseLogs, useWeightLogs, usePainLogs } from '@/hooks/useLogs';
import { useActivePlan } from '@/hooks/usePlan';

export function Insights() {
  const { data: exerciseLogs = [] } = useExerciseLogs();
  const { data: weightLogs = [] } = useWeightLogs();
  const { data: painLogs = [] } = usePainLogs();
  const { data: activePlan } = useActivePlan();

  const mockAdherence = [
    { day: 'Mon', score: 85 }, { day: 'Tue', score: 92 }, { day: 'Wed', score: 88 },
    { day: 'Thu', score: 40 }, { day: 'Fri', score: 75 }, { day: 'Sat', score: 95 }, { day: 'Sun', score: 98 },
  ];

  const riskRadar = [
    { subject: 'Overload', A: 40, fullMark: 100 },
    { subject: 'Pain Trend', A: painLogs.length > 0 ? Math.min(100, painLogs[0].intensity * 10) : 20, fullMark: 100 },
    { subject: 'Rest Quality', A: 85, fullMark: 100 },
    { subject: 'Consistency', A: exerciseLogs.length > 0 ? Math.min(100, (exerciseLogs.length / 30) * 100) : 10, fullMark: 100 },
    { subject: 'Macro Ratio', A: 75, fullMark: 100 },
  ];
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="size-10 text-primary" /> AI Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Predictive analysis and risk assessment powered by GPT-4.</p>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 py-1.5 px-4 font-bold uppercase tracking-widest text-[10px]">
          Live AI Analysis Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Status Card */}
        <Card className="glass border-white/5 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="size-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500/20 flex items-center justify-center mb-6 relative">
             <div className="absolute inset-0 rounded-full border-t-4 border-emerald-500 animate-spin duration-[3000ms]" />
             <ShieldAlert className="size-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Optimal Recovery</h2>
          <p className="text-sm text-muted-foreground px-6 leading-relaxed">
            Your current RPE trends and reported pain levels indicate a low risk of injury. Recovery is ahead of schedule.
          </p>
          <div className="mt-8 flex gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">LOW RISK</Badge>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">STABLE TREND</Badge>
          </div>
        </Card>

        {/* Holistic Data Radar */}
        <Card className="glass border-white/5 p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-xl font-bold text-white">Holistic Health Matrix</h3>
               <p className="text-xs text-muted-foreground mt-1">Multi-dimensional analysis of your current performance state.</p>
             </div>
             <BarChart3 className="size-5 text-muted-foreground" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskRadar}>
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="#4fb6b2"
                  fill="#4fb6b2"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Recommendations */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Zap className="size-3 text-amber-400" /> Strategic AI Adjustments
          </h3>
          {[
            { 
              title: 'Load Management', 
              desc: 'Based on Thursday\'s high RPE (9), we suggest reducing intensity on Saturday\'s squat session by 10%.', 
              icon: TrendingUp, 
              color: 'text-amber-400',
              action: 'Apply Swap'
            },
            { 
              title: 'Nutritional Optimization', 
              desc: 'Your evening protein intake has been 15% below target on workout days. Consider adding a casein-rich snack.', 
              icon: Brain, 
              color: 'text-primary',
              action: 'Update Goal'
            },
            { 
              title: 'Sleep Correlation', 
              desc: 'Low rest scores on Wednesday correlated with lower rep completion. Aim for 30 mins extra sleep tonight.', 
              icon: Activity, 
              color: 'text-blue-400',
              action: 'Log Sleep'
            },
          ].map((rec, i) => (
            <Card key={i} className="glass p-6 border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-start gap-4">
                <div className={cn("size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0", rec.color)}>
                  <rec.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{rec.title}</h4>
                    <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-tight text-primary">
                      {rec.action} <ChevronRight className="size-3 ml-1" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Adherence Forecast */}
        <Card className="glass border-white/5 p-8 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white">Adherence Forecast</h3>
            <p className="text-xs text-muted-foreground mt-1">Predicting next week's performance based on historical patterns.</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAdherence}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4fb6b2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4fb6b2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#4fb6b2' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4fb6b2" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
             <Info className="size-5 text-primary" />
             <p className="text-xs text-muted-foreground leading-snug">
               <span className="text-white font-bold">Observation:</span> You often drop adherence on Thursdays. The AI has scheduled a lighter "Active Recovery" day next Thursday to prevent fallout.
             </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
