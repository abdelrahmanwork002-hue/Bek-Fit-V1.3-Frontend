import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { setApiToken } from '@/lib/api';

export function useExercises(filters?: { search?: string; target?: string }) {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: ['exercises', filters],
    queryFn: async () => {
      const token = await getToken();
      setApiToken(token);
      const response = await api.get('/api/exercises', { params: filters });
      return response.data;
    },
  });

  return query;
}
