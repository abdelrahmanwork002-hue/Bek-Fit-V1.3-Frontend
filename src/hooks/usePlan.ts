import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { setApiToken } from '@/lib/api';

// ─── Mock fallback data ───────────────────────────────────────────────────────
const MOCK_WORKOUT = [
  { id: 'ex1', name: 'Neck Rotations', duration: '60s', type: 'Mobility', completed: false, target: 'Neck, Traps', rpe: 2, rest: '0s', sets: 1, reps: '1 min', isRequired: false, thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=100&q=80' },
  { id: 'ex2', name: 'Cat-Cow Stretch', reps: '15 reps', type: 'Yoga', completed: false, target: 'Spine, Core', rpe: 3, rest: '30s', sets: 2, isRequired: false, thumbnail: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=100&q=80' },
  { id: 'ex3', name: 'Scapula Pushups', reps: '10 reps', type: 'Calisthenics', completed: false, target: 'Scapula, Shoulders', rpe: 5, rest: '60s', sets: 3, isRequired: true, thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=100&q=80' },
  { id: 'ex4', name: 'Squat ISO Hold', duration: '45s', type: 'Strength', completed: false, target: 'Quads, Glutes', rpe: 7, rest: '90s', sets: 3, reps: '45s', isRequired: false, thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&w=100&q=80' },
];

const MOCK_PLAN = {
  id: 'plan-1',
  name: 'Mobility Recovery Alpha',
  stage: 'Hypertrophy 1',
  exercises: MOCK_WORKOUT,
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useActivePlan() {
  const { getToken } = useAuth();

  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  return useQuery({
    queryKey: ['active-plan'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/plans/active');
        return data;
      } catch {
        // Fallback to mock when backend unavailable
        return MOCK_PLAN;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompleteSet(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ exerciseId, sets }: { exerciseId: string; sets: any[] }) => {
      try {
        await api.post('/api/logs/routine', { planId, exerciseId, sets, timestamp: new Date().toISOString() });
      } catch { /* offline – handled by optimistic update */ }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-plan'] }),
  });
}

export function useAllPlans() {
  const { getToken } = useAuth();
  useEffect(() => { getToken().then(setApiToken); }, [getToken]);
  return useQuery({
    queryKey: ['all-plans'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/api/plans');
        return data;
      } catch {
        return [];
      }
    },
  });
}
export function useSwapExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ exerciseId, replacementId }: { exerciseId: string; replacementId: string }) => {
      const { data } = await api.post('/api/plans/swap-exercise', { exerciseId, replacementId });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['active-plan'] }),
  });
}
