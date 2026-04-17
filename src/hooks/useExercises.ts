import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api, { setApiToken } from '@/lib/api';

export function useExercises({ search = '' }: { search?: string } = {}) {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then(setApiToken);
  }, [getToken]);

  return useQuery({
    queryKey: ['exercises', search],
    queryFn: async () => {
      const { data } = await api.get('/api/exercises', { params: { search } });
      return data;
    },
  });
}
