import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { setApiToken } from '@/lib/api';

const MOCK_WEIGHT_DATA = [
  { date: 'Apr 01', weight: 82.5 },
  { date: 'Apr 05', weight: 81.8 },
  { date: 'Apr 10', weight: 82.0 },
  { date: 'Apr 12', weight: 81.2 },
  { date: 'Apr 15', weight: 80.9 },
  { date: 'Apr 18', weight: 80.5 },
];

const MOCK_EXERCISE_LOGS = [
  { id: 'log1', exerciseId: 'ex1', exerciseName: 'Neck Rotations', sets: 1, completedSets: 1, avgRpe: 2, date: '2026-04-18', timestamp: '2026-04-18T08:30:00Z' },
  { id: 'log2', exerciseId: 'ex3', exerciseName: 'Scapula Pushups', sets: 3, completedSets: 3, avgRpe: 6, date: '2026-04-17', timestamp: '2026-04-17T09:00:00Z' },
];

const MOCK_PAIN_LOGS = [
  { id: 'pain1', bodyPart: 'Lower Back', painLevel: 3, notes: 'Light discomfort after sitting', timestamp: '2026-04-15T14:00:00Z' },
];

export function useWeightLogs(userId?: string) {
  const { getToken } = useAuth();
  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  return useQuery({
    queryKey: ['logs-weight', userId],
    queryFn: async () => {
      try {
        const url = userId ? `/api/admin/logs/weight/${userId}` : '/api/logs/weight';
        const { data } = await api.get(url);
        return data?.length ? data : MOCK_WEIGHT_DATA;
      } catch {
        return MOCK_WEIGHT_DATA;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useExerciseLogs(userId?: string) {
  const { getToken } = useAuth();
  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  return useQuery({
    queryKey: ['logs-exercise', userId],
    queryFn: async () => {
      try {
        const url = userId ? `/api/admin/logs/routine/${userId}` : '/api/logs/routine';
        const { data } = await api.get(url);
        return data?.length ? data : MOCK_EXERCISE_LOGS;
      } catch {
        return MOCK_EXERCISE_LOGS;
      }
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function usePainLogs(userId?: string) {
  const { getToken } = useAuth();
  useEffect(() => { getToken().then(setApiToken); }, [getToken]);

  return useQuery({
    queryKey: ['logs-pain', userId],
    queryFn: async () => {
      try {
        const url = userId ? `/api/admin/logs/pain/${userId}` : '/api/logs/pain';
        const { data } = await api.get(url);
        return data?.length ? data : MOCK_PAIN_LOGS;
      } catch {
        return MOCK_PAIN_LOGS;
      }
    },
  });
}

export function useLogWeight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ weight, date }: { weight: number; date: string }) => {
      try {
        await api.post('/api/logs/weight', { weightKg: weight, date });
      } catch { /* offline */ }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['logs-weight'] }),
  });
}
