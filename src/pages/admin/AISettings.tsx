import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings2, Trash2, Plus, Play, History, ShieldAlert, Cpu, Activity, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

const agents = [
  { id: '1', name: 'Risk Scouter', model: 'gpt-4o', temperature: 0.3, status: 'Active', tokens: '1.8M' },
  { id: '2', name: 'Plan Generator', model: 'gpt-4-turbo', temperature: 0.7, status: 'Active', tokens: '1.2M' },
  { id: '3', name: 'Nutritionist Bot', model: 'gpt-4o-mini', temperature: 0.4, status: 'Active', tokens: '620K' },
];

export function AISettings() {
  const [riskSensitivity, setRiskSensitivity] = useState([65]);
  const [rpeThreshold, setRpeThreshold] = useState([85]);

  return (
    <div className="space-y-8 animate-in fade-in transition-all duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">AI Control Center</h1>
          <p className="text-muted-foreground mt-1 text-sm">Fine-tune risk sensitivity, monitor agent health, and configure model parameters.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass border-white/5 shadow-xl font-bold">
            <History className="size-4 mr-2" /> Global Audit
          </Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6">
            <Plus className="size-4 mr-2" /> New Agent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Strategy Knobs (Story 3.2 Enhancement) */}
        <Card className="lg:col-span-2 glass border-white/5 p-8 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Cpu className="size-40 text-primary" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="size-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                 <ShieldAlert className="size-6" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white">Risk Intelligence Calibration</h3>
                 <p className="text-xs text-muted-foreground">Define the thresholds that trigger proactive safety alerts.</p>
               </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-white">Aggregated Risk Sensitivity</label>
                    <Badge className="bg-orange-500/20 text-orange-400 border-none">{riskSensitivity}%</Badge>
                 </div>
                 <Slider 
                   defaultValue={[65]} 
                   max={100} 
                   step={1} 
                   onValueChange={setRiskSensitivity}
                   className="accent-orange-500" 
                 />
                 <p className="text-[10px] text-muted-foreground leading-relaxed">
                   Determines how aggressively the system flags fatigue patterns. High sensitivity leads to more frequent "Active Recovery" suggestions.
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-white">Critical RPE Trigger</label>
                    <Badge className="bg-rose-500/20 text-rose-400 border-none">{rpeThreshold}% Sensitivity</Badge>
                 </div>
                 <Slider 
                   defaultValue={[85]} 
                   max={100} 
                   step={1} 
                   onValueChange={setRpeThreshold}
                   className="accent-rose-500" 
                 />
                 <p className="text-[10px] text-muted-foreground leading-relaxed">
                   Threshold for notifying coaching staff of potential overtraining based on sustained RPE reports &gt; 9.
                 </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
               <Button className="bg-orange-500 hover:bg-orange-600 font-bold px-8 shadow-lg shadow-orange-500/10">Apply Neural Weights</Button>
               <Button variant="ghost" className="text-muted-foreground hover:text-white">Reset to Baseline</Button>
            </div>
          </div>
        </Card>

        {/* Global Tokens Overview */}
        <Card className="glass border-white/5 p-8 flex flex-col justify-between overflow-hidden relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Usage Telemetry</h3>
              <Activity className="size-4 text-primary" />
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-black text-white">3.62M</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total Monthly Tokens</div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
               {[
                 { label: 'Input Tokens', value: '2.1M', color: 'bg-primary' },
                 { label: 'Outout Tokens', value: '1.5M', color: 'bg-emerald-400' },
                 { label: 'Cache Hits', value: '14%', color: 'bg-blue-400' },
               ].map((stat, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                     <span>{stat.label}</span>
                     <span className="text-white">{stat.value}</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className={cn("h-full rounded-full opacity-60", stat.color)} style={{ width: '40%' }} />
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
             <Info className="size-4 text-primary mt-0.5" />
             <p className="text-[10px] text-muted-foreground leading-relaxed">
               Billing Alert: You are at 72% of your monthly OpenAI tier.
             </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <Card key={agent.id} className="glass border-white/5 group hover:border-primary/40 transition-all duration-500 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
               <Bot className="size-20 text-white" />
            </div>
            
            <CardHeader className="p-0">
              <div className="p-6 flex items-start justify-between">
                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary">
                  <Cpu className="size-6" />
                </div>
                <Badge variant="secondary" className={cn(
                  "bg-opacity-10 border-none font-black text-[9px] tracking-widest uppercase",
                  agent.status === 'Active' ? "bg-emerald-500 text-emerald-400" : "bg-orange-500 text-orange-400"
                )}>
                  {agent.status}
                </Badge>
              </div>
              <div className="px-6 pb-6">
                <CardTitle className="text-xl font-bold text-white group-hover:text-primary transition-colors">{agent.name}</CardTitle>
                <CardDescription className="font-mono text-[9px] uppercase tracking-widest mt-1 opacity-60">
                  Model: {agent.model}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-0 border-t border-white/5 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Temperature</div>
                  <div className="text-sm font-black text-white">{agent.temperature}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">Tokens</div>
                  <div className="text-sm font-black text-white">{agent.tokens}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest">
                  <Settings2 className="size-3 mr-2" /> Settings
                </Button>
                <Button variant="ghost" size="icon" className="size-10 bg-white/5 border border-white/5 hover:text-red-400 transition-colors">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
