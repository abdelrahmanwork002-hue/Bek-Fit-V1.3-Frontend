import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoveRight, Users, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';

const funnelData = [
  { step: 'Account Start', count: 420, color: '#4fb6b2' },
  { step: 'Goal Selection', count: 385, color: '#4fb6b2' },
  { step: 'Level Assessment', count: 310, color: '#4fb6b2' },
  { step: 'Bio-Sync (Habits)', count: 245, color: '#fbbf24' },
  { step: 'Plan Generated', count: 182, color: '#10b981' },
];

export function OnboardingFunnel() {
  return (
    <Card className="glass border-white/5 p-8 overflow-hidden relative">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Onboarding Funnel</h3>
          <p className="text-xs text-muted-foreground mt-1">Identifying friction points in the athlete acquisition loop.</p>
        </div>
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase">Critical Path</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-[250px] w-full">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                 <XAxis type="number" hide />
                 <XAxis type="category" dataKey="step" hide />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0F1115', border: '1px solid #ffffff10', borderRadius: '12px' }}
                   cursor={{ fill: 'transparent' }}
                 />
                 <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} opacity={0.6 + (index * 0.1)} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>

        <div className="space-y-4">
           {funnelData.map((stage, i) => {
             const prevCount = i > 0 ? funnelData[i-1].count : stage.count;
             const dropRate = i > 0 ? Math.round(((prevCount - stage.count) / prevCount) * 100) : 0;
             
             return (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:text-primary transition-colors">
                      0{i+1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{stage.step}</div>
                      <div className="text-[10px] text-muted-foreground">{stage.count} Athletes reached</div>
                    </div>
                  </div>
                  {i > 0 && (
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-black uppercase tracking-tighter",
                      dropRate > 15 ? "text-rose-400 border-rose-500/20" : "text-emerald-400 border-emerald-500/20"
                    )}>
                      -{dropRate}% DROP
                    </Badge>
                  )}
               </div>
             );
           })}
        </div>
      </div>

      <div className="mt-10 p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-rose-500/10 transition-all">
         <div className="flex items-center gap-4">
            <AlertCircle className="size-5 text-rose-400 animate-pulse" />
            <div>
               <div className="text-xs font-bold text-white uppercase tracking-tighter">Bottleneck Detected: Bio-Sync Step</div>
               <p className="text-[9px] text-muted-foreground mt-0.5">26.5% of users fail to complete lifestyle habits assessment.</p>
            </div>
         </div>
         <Button size="sm" variant="ghost" className="text-xs text-rose-400 hover:text-rose-400 hover:bg-white/5 uppercase font-black">
            Analyze Friction <MoveRight className="size-3 ml-2" />
         </Button>
      </div>

      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
         <TrendingUp className="size-40 text-primary" />
      </div>
    </Card>
  );
}
