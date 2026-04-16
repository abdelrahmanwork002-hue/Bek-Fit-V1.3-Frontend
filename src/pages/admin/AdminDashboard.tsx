import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Bot, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">System Overview</h1>
          <p className="text-muted-foreground">Real-time health of the BekFit platform.</p>
        </div>
        <Badge variant="outline" className="h-8 border-primary/20 bg-primary/10 text-primary">
          Live Sync Enabled
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Active Champions', value: '47,201', trend: '+12%' },
          { icon: Activity, label: 'Total Routines', value: '1.4M', trend: '+8%' },
          { icon: Bot, label: 'AI Success Rate', value: '99.4%', trend: '+0.2%' },
          { icon: TrendingUp, label: 'Retention Rate', value: '82%', trend: '+4%' },
        ].map((stat, i) => (
          <Card key={i} className="glass border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
              <stat.icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">{stat.trend} <span className="text-muted-foreground font-normal">from last month</span></p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-white/5">
          <CardHeader>
            <CardTitle>Platform Engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground italic">
            [Interactive Engagement Graph - Recharts Integration Ready]
          </CardContent>
        </Card>

        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>System Alerts</CardTitle>
            <AlertCircle className="size-5 text-orange-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'New Coach Request', desc: 'Sarah Wilson applied.', time: '2m ago' },
              { title: 'AI Model Update', desc: 'GPT-4o successfully deployed.', time: '1h ago' },
              { title: 'High Latency detected', desc: 'Regional edge node at 80%.', time: '3h ago' },
            ].map((alert, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-white">{alert.title}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{alert.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{alert.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
