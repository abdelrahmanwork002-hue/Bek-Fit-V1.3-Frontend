import React, { useState } from 'react';
import { Bell, X, CheckCircle2, Zap, Utensils, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'workout' | 'nutrition' | 'ai' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'ai', title: 'AI Plan Updated', message: 'Your coach has refined your recovery protocol based on last week\'s RPE data.', time: '2h ago', read: false },
  { id: '2', type: 'workout', title: 'Workout Reminder', message: 'You have not logged today\'s session. Scapula Pushups are waiting.', time: '4h ago', read: false },
  { id: '3', type: 'nutrition', title: 'Macro Goal Reached', message: 'Great work! You\'ve hit your protein target of 120g for today.', time: '6h ago', read: true },
  { id: '4', type: 'system', title: 'Movement Reminder', message: 'You\'ve been sedentary for 90 minutes. Take a 2-minute mobility break.', time: '1d ago', read: true },
];

const TYPE_ICONS: Record<string, any> = {
  workout: Activity,
  nutrition: Utensils,
  ai: Zap,
  system: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  workout: 'text-primary bg-primary/10 border-primary/20',
  nutrition: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  ai: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  system: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground hover:text-white"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 size-4 bg-primary rounded-full text-[9px] font-black text-white flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-96 bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Notifications</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{unreadCount} unread messages</p>
              </div>
              <button onClick={markAllRead} className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest">
                Mark all read
              </button>
            </div>

            <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <CheckCircle2 className="size-8 mx-auto mb-3 text-emerald-400" />
                  You're all caught up!
                </div>
              ) : notifications.map(notif => {
                const Icon = TYPE_ICONS[notif.type];
                return (
                  <div key={notif.id} className={cn("p-5 flex items-start gap-4 hover:bg-white/[0.03] transition-colors relative group", !notif.read && "bg-primary/[0.03]")}>
                    <div className={cn("size-9 rounded-xl border flex items-center justify-center shrink-0", TYPE_COLORS[notif.type])}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{notif.title}</span>
                        {!notif.read && <span className="size-1.5 bg-primary rounded-full" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
                      <span className="text-[9px] text-primary font-bold uppercase tracking-widest mt-2 block">{notif.time}</span>
                    </div>
                    <button
                      onClick={() => dismiss(notif.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/5">
              <button className="w-full text-[11px] font-bold text-muted-foreground hover:text-white transition-colors uppercase tracking-widest text-center">
                View All Activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
