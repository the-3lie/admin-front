import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface FiltresExport {
  from?: string;
  to?: string;
  classId?: string;
}

export function useHistoriqueExports() {
  return useQuery({
    queryKey: ['reports-history'],
    queryFn: async () => (await api.get('/admin/reports/history')).data,
  });
}

/**
 * Génère puis télécharge directement la fiche de présence (le lien de
 * téléchargement exige le jeton admin, donc on ne peut pas se contenter
 * d'un <a href> — on récupère le contenu en blob et on déclenche
 * l'enregistrement nous-mêmes.
 */
export function useTelechargerPresences() {
  return useMutation({
    mutationFn: async (filtres: FiltresExport) => {
      const { data: demande } = await api.post('/admin/reports/export', {
        format: 'csv',
        ...filtres,
      });

      const reponse = await api.get(demande.url.replace(/^\/api/, ''), {
        responseType: 'blob',
      });

      const nomFichier =
        reponse.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] ??
        `presences-${demande.id}.csv`;

      const url = window.URL.createObjectURL(new Blob([reponse.data]));
      const lien = document.createElement('a');
      lien.href = url;
      lien.download = nomFichier;
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      window.URL.revokeObjectURL(url);

      return demande;
    },
  });
}
