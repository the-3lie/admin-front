import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

/* --------------------------------- Séances -------------------------------- */

export function useSessionsAdmin(filters: { status?: string; classId?: string } = {}) {
  return useQuery({
    queryKey: ['sessions-admin', filters],
    queryFn: async () => (await api.get('/admin/sessions', { params: filters })).data,
    refetchInterval: 15_000,
  });
}

export function useQrMonitor() {
  return useQuery({
    queryKey: ['qr-monitor'],
    queryFn: async () => (await api.get('/admin/qr-codes')).data,
    refetchInterval: 10_000,
  });
}

export function useRelancerSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/sessions/${id}/relaunch`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions-admin'] });
      qc.invalidateQueries({ queryKey: ['qr-monitor'] });
    },
  });
}

export function useCloturerSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/admin/sessions/${id}/close`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sessions-admin'] });
      qc.invalidateQueries({ queryKey: ['qr-monitor'] });
    },
  });
}

/* -------------------------------- Présences -------------------------------- */

export function useAttendancesAdmin(
  filters: { classId?: string; status?: string; from?: string; to?: string } = {},
) {
  return useQuery({
    queryKey: ['attendances-admin', filters],
    queryFn: async () => (await api.get('/admin/attendances', { params: filters })).data,
  });
}

export function useCorrigerPresence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      api.patch(`/admin/attendances/${id}`, { status, note }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendances-admin'] }),
  });
}

export function useAjouterPresenceManuelle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { sessionId: string; studentId: string; status: string; note?: string }) =>
      api.post('/admin/attendances/manual', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['attendances-admin'] }),
  });
}
