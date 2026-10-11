import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useFraudAlerts(filters: { status?: string; severity?: string } = {}) {
  return useQuery({
    queryKey: ['fraud-alerts', filters],
    queryFn: async () => (await api.get('/admin/fraud/alerts', { params: filters })).data,
  });
}

export function useFraudStats() {
  return useQuery({
    queryKey: ['fraud-stats'],
    queryFn: async () => (await api.get('/admin/fraud/stats')).data,
    refetchInterval: 30_000,
  });
}

export function useLancerDetectionFraude() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/admin/fraud/run', {}).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fraud-alerts'] });
      qc.invalidateQueries({ queryKey: ['fraud-stats'] });
    },
  });
}

export function useTraiterAlerte() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: 'CONFIRMED' | 'DISMISSED' | 'RESOLVED';
      note?: string;
    }) => api.patch(`/admin/fraud/alerts/${id}`, { status, note }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fraud-alerts'] });
      qc.invalidateQueries({ queryKey: ['fraud-stats'] });
    },
  });
}
