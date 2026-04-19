import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { setApiToken } from '@/lib/api';

export function useOnboarding() {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then(setApiToken);
  }, [getToken]);

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/users/onboarding', data);
      return response.data;
    }
  });
}
