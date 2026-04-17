import api from '@/lib/api';

export interface SetLog {
  reps: number;
  weight: number;
  rpe: number;
  status: 'completed' | 'skipped' | 'pending';
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  timestamp: string;
}

export interface NutritionLog {
  type: string; // Breakfast, Lunch, etc.
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
}

export const logService = {
  saveExerciseLog: async (log: ExerciseLog) => {
    const response = await api.post('/api/logs/routine', log);
    return response.data;
  },

  saveNutritionLog: async (log: NutritionLog) => {
    const response = await api.post('/api/logs/nutrition', log);
    return response.data;
  },

  saveWeightLog: async (weight: number, date: string) => {
    const response = await api.post('/api/logs/weight', { weight, date });
    return response.data;
  },

  getRecentLogs: async (userId: string) => {
    const response = await api.get(`/api/logs/recent/${userId}`);
    return response.data;
  }
};
