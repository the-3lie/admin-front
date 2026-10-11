import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Creneau, Enseignant, Salle, SchoolClass, Subject, TypeSalle } from '@/types';

/* --------------------------- Référentiel (listes) -------------------------- */

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => (await api.get<SchoolClass[]>('/admin/classes')).data,
  });
}

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => (await api.get<Subject[]>('/admin/subjects')).data,
  });
}

export function useEnseignantsListe() {
  return useQuery({
    queryKey: ['enseignants-liste'],
    queryFn: async () => (await api.get<Enseignant[]>('/admin/teachers')).data,
  });
}

/* --------------------------------- Salles --------------------------------- */

export function useSalles() {
  return useQuery({
    queryKey: ['salles'],
    queryFn: async () => (await api.get<Salle[]>('/admin/rooms')).data,
  });
}

export function useCreerSalle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { name: string; type: TypeSalle; capacity: number }) =>
      api.post('/admin/rooms', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salles'] }),
  });
}

export function useModifierSalle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...dto
    }: {
      id: string;
      name?: string;
      type?: TypeSalle;
      capacity?: number;
    }) => api.patch(`/admin/rooms/${id}`, dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salles'] }),
  });
}

export function useSupprimerSalle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/rooms/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salles'] }),
  });
}

/* ----------------------------- Emploi du temps ----------------------------- */

export function useCreneaux(classId?: string) {
  return useQuery({
    queryKey: ['creneaux', classId],
    queryFn: async () =>
      (await api.get<Creneau[]>('/admin/schedules', { params: { classId } })).data,
  });
}

export function useCreerCreneau() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: {
      classId: string;
      subjectId: string;
      teacherId: string;
      roomId: string;
      sessionType: TypeSalle;
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }) => api.post('/admin/schedules', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['creneaux'] }),
  });
}

export function useModifierCreneau() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...dto
    }: {
      id: string;
      classId?: string;
      subjectId?: string;
      teacherId?: string;
      roomId?: string;
      sessionType?: TypeSalle;
      dayOfWeek?: number;
      startTime?: string;
      endTime?: string;
    }) => api.patch(`/admin/schedules/${id}`, dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['creneaux'] }),
  });
}

export function useSupprimerCreneau() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/schedules/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['creneaux'] }),
  });
}
