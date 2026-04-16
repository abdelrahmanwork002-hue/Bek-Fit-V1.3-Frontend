import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { setApiToken } from '@/lib/api';

export function useProfile() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = await getToken();
      setApiToken(token);
      const response = await api.get('/api/profiles/me');
      return response.data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      const token = await getToken();
      setApiToken(token);
      const response = await api.patch('/api/profiles/me', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return { ...profileQuery, updateProfile };
}
