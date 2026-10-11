import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard/stats')).data,
  });
}
