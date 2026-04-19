import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, BookOpen, Rocket, Dumbbell, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlanModal({ isOpen, onClose }: CreatePlanModalProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', duration: '12 Weeks', type: 'Strength', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createPlan = useMutation({
    mutationFn: async (data: typeof formData) => {
      const resp = await api.post('/api/plans', { ...data, status: 'draft' });
      return resp.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['all-plans'] });
      setSuccess(true);
      setTimeout(() => { 
        setSuccess(false); 
        onClose(); 
        setFormData({ name: '', duration: '12 Weeks', type: 'Strength', description: '' }); 
        if (data?.id) navigate(`/admin/plans/designer/${data.id}`);
      }, 1500);
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to create plan. Check your connection.');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.name.trim()) { setError('Plan name is required.'); return; }
    setError('');
    createPlan.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              {success ? <CheckCircle2 className="size-8 text-emerald-400" /> : <Zap className="size-8 animate-pulse" />}
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Architect New System</h2>
              <p className="text-sm text-muted-foreground font-medium">Design a high-performance training template.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
            <X className="size-8" />
          </button>
        </div>

        <div className="p-10 space-y-10">
          {error && <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm">{error}</div>}
          {success && <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-bold">Plan created successfully!</div>}

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Program Name *</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 text-white font-bold" placeholder="e.g. Hypertrophy Master v2" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cycle Duration</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 text-white font-bold" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}>
                <option value="4 Weeks">4 Weeks (Microcycle)</option>
                <option value="8 Weeks">8 Weeks (Mesocycle)</option>
                <option value="12 Weeks">12 Weeks (Full Cycle)</option>
                <option value="Ongoing">Ongoing / Adaptive</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary/50 text-white resize-none h-24" placeholder="Describe this plan's goals and who it's designed for..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Methodology</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'Strength', icon: Dumbbell, label: 'Power & Mass' },
                { id: 'Recovery', icon: BookOpen, label: 'Vitality Logic' },
                { id: 'AI-Adaptive', icon: Rocket, label: 'AI Generative' },
              ].map((type) => (
                <button key={type.id} onClick={() => setFormData({ ...formData, type: type.id })} className={cn("p-6 rounded-[30px] border transition-all text-left space-y-3 group", formData.type === type.id ? "bg-primary/10 border-primary/40" : "bg-white/5 border-white/10 hover:border-white/20")}>
                  <type.icon className={cn("size-6 transition-transform group-hover:scale-110", formData.type === type.id ? "text-primary" : "text-muted-foreground")} />
                  <div className={cn("text-xs font-black uppercase tracking-tight", formData.type === type.id ? "text-white" : "text-muted-foreground")}>{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-white font-bold" onClick={onClose}>Discard</Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 px-12 h-14 rounded-2xl font-black uppercase tracking-widest italic" onClick={handleSubmit} disabled={createPlan.isPending}>
            {createPlan.isPending ? <Loader2 className="size-5 mr-2 animate-spin" /> : null}
            {createPlan.isPending ? 'Creating...' : 'Initialize System'}
          </Button>
        </div>
      </div>
    </div>
  );
}
