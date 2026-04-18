import React, { useState } from 'react';
import { X, Save, Video, Image, Dumbbell, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise?: any;
}

export function EditExerciseModal({ isOpen, onClose, exercise }: ExerciseModalProps) {
  const [formData, setFormData] = useState({
    title: exercise?.title || '',
    type: exercise?.type || 'Strength',
    targetMuscle: exercise?.targetMuscle || '',
    difficulty: exercise?.difficulty || 'Beginner',
    equipment: exercise?.equipmentNeeded || [],
    description: exercise?.description || '',
  });

  const [newEquipment, setNewEquipment] = useState('');

  if (!isOpen) return null;

  const handleAddEquipment = () => {
    if (newEquipment) {
      setFormData({ ...formData, equipment: [...formData.equipment, newEquipment] });
      setNewEquipment('');
    }
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
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Exercise Title</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
                placeholder="e.g. Weighted Pullups"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Muscle Group</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
                placeholder="e.g. Scapula, Lats"
                value={formData.targetMuscle}
                onChange={(e) => setFormData({ ...formData, targetMuscle: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Movement Type</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Strength">Strength</option>
                <option value="Mobility">Mobility</option>
                <option value="Cardio">Cardio</option>
                <option value="Isometrics">Isometrics</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty Level</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Master">Elite / Master</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Required Equipment</label>
            <div className="flex gap-2 mb-4 flex-wrap">
              {formData.equipment.map((eq: string, i: number) => (
                <Badge key={i} className="bg-primary/20 text-primary border-primary/10 gap-2 px-3 py-1">
                  {eq} <X className="size-3 cursor-pointer" onClick={() => setFormData({ ...formData, equipment: formData.equipment.filter((_: any, idx: number) => idx !== i) })}/>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white"
                placeholder="Type equipment (e.g. Dumbbell)"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEquipment()}
              />
              <Button onClick={handleAddEquipment} variant="outline" className="border-white/10 bg-white/5">
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">Asset Configuration</label>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.03] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-all">
                   <Video className="size-8 text-muted-foreground" />
                   <span className="text-xs font-bold text-muted-foreground">Connect Tutorial Link</span>
                </div>
                <div className="p-6 bg-white/[0.03] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-all">
                   <Image className="size-8 text-muted-foreground" />
                   <span className="text-xs font-bold text-muted-foreground">Upload Thumbnail</span>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3 font-bold">
           <Button variant="outline" className="border-white/10 bg-white/5 text-white" onClick={onClose}>
             Discard Changes
           </Button>
           <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-8">
             <Save className="size-4 mr-2" /> {exercise ? 'Save Movement' : 'Release Exercise'}
           </Button>
        </div>
      </div>
    </div>
  );
}
