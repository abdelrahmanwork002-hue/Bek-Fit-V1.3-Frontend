import React from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Zap, History, Settings2, LogOut, ChevronRight, Activity, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/stats');
      return data;
    }
  });

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
           <User className="size-8 text-primary" /> Athlete Profile
        </h1>
        <Button 
          variant="outline" 
          onClick={() => signOut()}
          className="bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold rounded-xl"
        >
          <LogOut className="size-4 mr-2" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="glass border-white/5 p-8 flex flex-col items-center text-center">
           <div className="size-24 rounded-3xl bg-primary/10 border-2 border-primary/20 p-1 mb-6 relative group">
              <img src={user.imageUrl} alt={user.fullName || ''} className="size-full object-cover rounded-[22px]" />
              <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-primary flex items-center justify-center border-4 border-[#0F1115]">
                 <Shield className="size-4 text-white" />
              </div>
           </div>
           <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
           <p className="text-sm text-muted-foreground mb-6">{user.primaryEmailAddress?.emailAddress}</p>
           
           <div className="flex gap-2 mb-8">
              <Badge className="bg-primary/20 text-primary border-primary/20">ELITE MEMBER</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">API SYNCED</Badge>
           </div>

           <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-12 rounded-2xl">
              <Settings2 className="size-4 mr-2" /> Account Settings
           </Button>
        </Card>

        {/* Vitality Stats */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass p-6 border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                       <Zap className="size-6 text-primary" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Training Consistency</div>
                       <div className="text-xl font-bold text-white">92% <span className="text-xs text-emerald-400 ml-1">+4%</span></div>
                    </div>
                 </div>
              </Card>
              <Card className="glass p-6 border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                       <Activity className="size-6 text-blue-400" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Biomechanical Risk</div>
                       <div className="text-xl font-bold text-white">LOW <span className="text-xs text-muted-foreground ml-1">STABLE</span></div>
                    </div>
                 </div>
              </Card>
           </div>

           <Card className="glass border-white/5 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                 <Target className="size-32 text-primary" />
              </div>
              <div className="relative z-10">
                 <h3 className="text-xl font-bold text-white mb-2">Platform Protocol</h3>
                 <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                   Your current AI training protocol is optimized for <span className="text-primary font-bold italic">Advanced Hypertrophy</span>. 
                   Last assessment was 4 days ago. Take your next vitality assessment to check for plan evolution.
                 </p>
                 <Button className="bg-primary hover:bg-primary/90 font-bold px-8 shadow-lg shadow-primary/20 rounded-xl">
                   Retake Vitality Assessment
                 </Button>
              </div>
           </Card>

           <div className="space-y-4 pt-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 <History className="size-3" /> Recent Platform Activity
              </h3>
              {[
                 { title: 'Subscribed to Elite Tier', date: 'Apr 15', icon: Shield },
                 { title: 'Completed Mobility Week 2', date: 'Apr 12', icon: Zap },
                 { title: 'AI Plan Regenerated', date: 'Apr 10', icon: Bot },
              ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:text-primary transition-colors">
                          <item.icon className="size-4" />
                       </div>
                       <div>
                          <div className="text-sm font-bold text-white">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">{item.date}</div>
                       </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

const Bot = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V4M12 4L9 7M12 4L15 7M7 13V15.5M17 13V15.5M5 14C5 17.866 8.13401 21 12 21C15.866 21 19 17.866 19 14V11C19 9.34315 17.6569 8 16 8H8C6.34315 8 5 9.34315 5 11V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
