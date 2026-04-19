import React, { useState, useEffect } from 'react';
import { X, Save, Video, Image, Dumbbell, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise?: any;
}

export function EditExerciseModal({ isOpen, onClose, exercise }: ExerciseModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Strength',
    targetMuscle: '',
    difficulty: 'Beginner',
    equipment: [] as string[],
    description: '',
    isRequired: false,
    defaultSets: 3,
    defaultReps: '10',
    defaultRpe: 7,
    defaultRest: '60s',
  });
  const [newEquipment, setNewEquipment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title || '',
        type: exercise.type || 'Strength',
        targetMuscle: exercise.targetMuscle || '',
        difficulty: exercise.difficulty || 'Beginner',
        equipment: exercise.equipmentNeeded || [],
        description: exercise.description || '',
        isRequired: exercise.isRequired || false,
        defaultSets: exercise.defaultSets || 3,
        defaultReps: exercise.defaultReps || '10',
        defaultRpe: exercise.defaultRpe || 7,
        defaultRest: exercise.defaultRest || '60s',
      });
    } else {
      setFormData({ title: '', type: 'Strength', targetMuscle: '', difficulty: 'Beginner', equipment: [], description: '', isRequired: false, defaultSets: 3, defaultReps: '10', defaultRpe: 7, defaultRest: '60s' });
    }
  }, [exercise, isOpen]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (exercise?.id) {
        await api.patch(`/api/exercises/${exercise.id}`, data);
      } else {
        await api.post('/api/exercises', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || 'Failed to save exercise. Check your connection.');
    },
  });

  if (!isOpen) return null;

  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      setFormData({ ...formData, equipment: [...formData.equipment, newEquipment.trim()] });
      setNewEquipment('');
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) { setError('Exercise title is required.'); return; }
    if (!formData.targetMuscle.trim()) { setError('Target muscle group is required.'); return; }
    setError('');
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#0F1115] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Dumbbell className="size-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{exercise ? 'Edit Movement' : 'Configure New Exercise'}</h2>
              <p className="text-sm text-muted-foreground">Define movement properties and biomechanical tags.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
            <X className="size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Exercise Title *</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white" placeholder="e.g. Weighted Pullups" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Muscle Group *</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white" placeholder="e.g. Scapula, Lats" value={formData.targetMuscle} onChange={(e) => setFormData({ ...formData, targetMuscle: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Movement Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="Strength">Strength</option>
                <option value="Mobility">Mobility</option>
                <option value="Cardio">Cardio</option>
                <option value="Isometrics">Isometrics</option>
                <option value="Calisthenics">Calisthenics</option>
                <option value="Yoga">Yoga</option>
                <option value="Recovery">Recovery</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty Level</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white" value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Master">Elite / Master</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Default Sets', key: 'defaultSets', type: 'number' },
              { label: 'Default Reps', key: 'defaultReps', type: 'text' },
              { label: 'Default RPE', key: 'defaultRpe', type: 'number' },
              { label: 'Rest Period', key: 'defaultRest', type: 'text' },
            ].map(field => (
              <div key={field.key} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{field.label}</label>
                <input
                  type={field.type}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary/50 text-white text-center"
                  value={(formData as any)[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white resize-none h-20" placeholder="Describe how to perform this exercise correctly..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Required Equipment</label>
            <div className="flex gap-2 mb-4 flex-wrap">
              {formData.equipment.map((eq, i) => (
                <Badge key={i} className="bg-primary/20 text-primary border-primary/10 gap-2 px-3 py-1">
                  {eq} <X className="size-3 cursor-pointer" onClick={() => setFormData({ ...formData, equipment: formData.equipment.filter((_, idx) => idx !== i) })} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white" placeholder="Type equipment (e.g. Dumbbell) and press Enter" value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddEquipment()} />
              <Button onClick={handleAddEquipment} variant="outline" className="border-white/10 bg-white/5"><Plus className="size-4" /></Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary" />
              <div>
                <div className="text-sm font-bold text-white">Mandatory Exercise</div>
                <div className="text-[10px] text-muted-foreground">Users will be warned before skipping this movement</div>
              </div>
            </div>
            <button onClick={() => setFormData({ ...formData, isRequired: !formData.isRequired })} className={cn("w-12 h-6 rounded-full transition-all relative", formData.isRequired ? "bg-primary" : "bg-white/10")}>
              <div className={cn("absolute top-1 size-4 bg-white rounded-full transition-all", formData.isRequired ? "left-7" : "left-1")} />
            </button>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
          <Button variant="outline" className="border-white/10 bg-white/5 text-white" onClick={onClose}>Discard</Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-8 font-bold" onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
            {exercise ? 'Save Changes' : 'Create Exercise'}
          </Button>
        </div>
      </div>
    </div>
  );
}
