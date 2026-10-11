import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useJournal(filters: { type?: string; actorRole?: string } = {}) {
  return useQuery({
    queryKey: ['journal', filters],
    queryFn: async () => (await api.get('/admin/activity-logs', { params: filters })).data,
    refetchInterval: 20_000,
  });
}
