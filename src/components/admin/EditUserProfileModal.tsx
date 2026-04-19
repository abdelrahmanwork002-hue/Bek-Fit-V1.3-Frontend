import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface EditUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; fullName: string; email: string } | null;
}

export function EditUserProfileModal({ isOpen, onClose, user }: EditUserProfileModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({
    heightCm: 175,
    weightKg: 80,
    activityLevel: 'sedentary',
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await api.patch(`/api/profiles/${user?.id}`, data);
    },
    onSuccess: () => {
      toast.success('Athlete profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
  });

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0F1115] border-white/10 text-white rounded-[32px] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Edit Protocol Data: {user.fullName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Height (CM)</label>
            <input 
              type="number" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Weight (KG)</label>
            <input 
              type="number" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Activity Level</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
            >
              <option value="sedentary">Sedentary (Office Work)</option>
              <option value="active">Active (1-3 sessions/week)</option>
              <option value="elite">Elite (Daily High Intensity)</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
             <Button variant="ghost" onClick={onClose} className="flex-1 h-14 rounded-2xl font-bold border border-white/5">Cancel</Button>
             <Button 
               onClick={() => mutation.mutate(formData)}
               className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest italic"
               disabled={mutation.isPending}
             >
               {mutation.isPending ? 'Syncing...' : 'Override Profile'}
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
