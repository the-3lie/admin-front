import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AdminCompte, ChefClasse, Enseignant, Etudiant, RoleAdmin } from '@/types';

/* -------------------------------- Étudiants ------------------------------- */

export function useEtudiants(search?: string) {
  return useQuery({
    queryKey: ['etudiants', search],
    queryFn: async () =>
      (await api.get<Etudiant[]>('/admin/students', { params: { search } })).data,
  });
}

export function useCreerEtudiant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: {
      matricule: string;
      firstName: string;
      lastName: string;
      email: string;
      classId: string;
    }) => api.post('/admin/students', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['etudiants'] }),
  });
}

export function useSuspendreEtudiant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspendre, reason }: { id: string; suspendre: boolean; reason?: string }) =>
      api
        .post(`/admin/students/${id}/${suspendre ? 'suspend' : 'reactivate'}`, { reason })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['etudiants'] }),
  });
}

export function useResetMotDePasseEtudiant() {
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/admin/students/${id}/reset-password`, {}).then((r) => r.data),
  });
}

/* ------------------------------- Enseignants ------------------------------ */

export function useEnseignants(search?: string) {
  return useQuery({
    queryKey: ['enseignants', search],
    queryFn: async () =>
      (await api.get<Enseignant[]>('/admin/teachers', { params: { search } })).data,
  });
}

export function useCreerEnseignant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: {
      firstName: string;
      lastName: string;
      email: string;
      department?: string;
      facultyId?: string;
    }) => api.post('/admin/teachers', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enseignants'] }),
  });
}

export function useSuspendreEnseignant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspendre, reason }: { id: string; suspendre: boolean; reason?: string }) =>
      api
        .post(`/admin/teachers/${id}/${suspendre ? 'suspend' : 'reactivate'}`, { reason })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['enseignants'] }),
  });
}

export function useResetMotDePasseEnseignant() {
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/admin/teachers/${id}/reset-password`, {}).then((r) => r.data),
  });
}

/* ----------------------------- Chefs de classe ----------------------------- */

export function useChefsClasse() {
  return useQuery({
    queryKey: ['chefs-classe'],
    queryFn: async () => (await api.get<ChefClasse[]>('/admin/leaders')).data,
  });
}

export function useAssignerChef() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      classId,
      studentId,
      isDeputy,
    }: {
      classId: string;
      studentId: string;
      isDeputy?: boolean;
    }) => api.post(`/admin/classes/${classId}/leader`, { studentId, isDeputy }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chefs-classe'] }),
  });
}

export function useRetirerChef() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, deputy }: { classId: string; deputy?: boolean }) =>
      api
        .post(`/admin/classes/${classId}/leader/remove`, null, { params: { deputy } })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chefs-classe'] }),
  });
}

/* ---------------------------- Administrateurs ------------------------------ */

export function useAdmins() {
  return useQuery({
    queryKey: ['admins'],
    queryFn: async () => (await api.get<AdminCompte[]>('/admin/admins')).data,
  });
}

export function useCreerAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { firstName: string; lastName: string; email: string; role: RoleAdmin }) =>
      api.post('/admin/admins', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }),
  });
}

export function useSuspendreAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspendre, reason }: { id: string; suspendre: boolean; reason?: string }) =>
      api
        .post(`/admin/admins/${id}/${suspendre ? 'suspend' : 'reactivate'}`, { reason })
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admins'] }),
  });
}

export function useResetMotDePasseAdmin() {
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/admin/admins/${id}/reset-password`, {}).then((r) => r.data),
  });
}
