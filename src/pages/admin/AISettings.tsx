import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Settings2, Trash2, Plus, Play, History, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const agents = [
  { id: '1', name: 'Plan Generator', model: 'gpt-4-turbo', temperature: 0.7, status: 'Active', tokens: '1.2M' },
  { id: '2', name: 'Meal Optimizer', model: 'gpt-3.5-turbo', temperature: 0.2, status: 'Active', tokens: '450K' },
  { id: '3', name: 'Support Bot', model: 'gpt-4o', temperature: 0.5, status: 'Paused', tokens: '0' },
];

export function AISettings() {
  return (
    <div className="space-y-8 animate-in fade-in transition-all duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Management</h1>
          <p className="text-muted-foreground mt-1">Configure, version, and monitor platform intelligence agents.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="border-white/5 ring-1 ring-white/10">
            <History className="size-4 mr-2" />
            Global Logs
          </Button>
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="size-4 mr-2" />
            Create New Agent
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="glass border-white/5 group hover:border-primary/30 transition-all duration-500 overflow-hidden">
            <CardHeader className="p-0">
              <div className="p-6 flex items-start justify-between">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bot className="size-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={cn(
                    "bg-opacity-20",
                    agent.status === 'Active' ? "bg-emerald-500 text-emerald-400" : "bg-orange-500 text-orange-400"
                  )}>
                    {agent.status}
                  </Badge>
                </div>
              </div>
              <div className="px-6 pb-4">
                <CardTitle className="text-xl">{agent.name}</CardTitle>
                <CardDescription className="font-mono text-[10px] uppercase tracking-widest mt-1">
                  ID: {agent.id}0x-V3
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Model</div>
                  <div className="text-sm font-semibold">{agent.model}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Temp</div>
                  <div className="text-sm font-semibold">{agent.temperature}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Token Usage</span>
                  <span className="font-semibold text-white">{agent.tokens} / 5M</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '24%' }} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Button variant="secondary" className="flex-1 bg-white/5 hover:bg-white/10 text-xs">
                  <Settings2 className="size-3 mr-2" />
                  Configure
                </Button>
                <Button variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-white">
                  <Play className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-9 text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RAG & Knowledge Base (Story 50) */}
      <Card className="glass border-primary/10 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShieldAlert className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Vector Knowledge Base</CardTitle>
                <CardDescription>Upload training data or health documentation for RAG.</CardDescription>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Attaching knowledge bases allows agents to provide context-aware responses based on your proprietary health data and latest research.
            </p>
            <Button size="lg" className="w-full md:w-auto shadow-xl shadow-primary/10">
              Manage Documents
            </Button>
          </div>
          <div className="bg-primary/5 p-8 border-l border-white/5">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Recent Vectors Linked</div>
            <ul className="space-y-4">
              {['Keto_Guidelines_2026.pdf', 'Mobility_Research_V4.md', 'User_Anatomy_Ref.csv'].map((file, i) => (
                <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                  <span className="text-sm font-medium">{file}</span>
                  <Badge variant="outline" className="text-[10px] border-white/10">READY</Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
