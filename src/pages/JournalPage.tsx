import { useState } from 'react';
import { History } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import { useJournal } from '@/hooks/useActivity';

const RESULTAT_STYLE: Record<string, string> = {
  success: 'text-present bg-present-bg',
  warning: 'text-late bg-late-bg',
  error: 'text-absent bg-absent-bg',
};

export default function JournalPage() {
  const [actorRole, setActorRole] = useState('');
  const { data, isLoading } = useJournal({ actorRole: actorRole || undefined });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-faint">
          Chaque action de chaque compte (admin, enseignant, étudiant, chef de classe) est
          journalisée ici.
        </p>
        <Select className="max-w-xs" value={actorRole} onChange={(e) => setActorRole(e.target.value)}>
          <option value="">Tous les comptes</option>
          <option value="admin">Administrateurs</option>
          <option value="teacher">Enseignants</option>
          <option value="student">Étudiants</option>
          <option value="class_leader">Chefs de classe</option>
        </Select>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : !data?.length ? (
        <EmptyState icon={History} title="Aucune activité" />
      ) : (
        <Card className="p-0">
          {data.map((e: any) => (
            <div key={e.id} className="ledger-row px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {e.user} — {e.action}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {e.entity} · {e.details}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${RESULTAT_STYLE[e.result] ?? 'bg-ink/5 text-ink-soft'}`}
                >
                  {e.result}
                </span>
                <span className="whitespace-nowrap text-xs text-ink-faint">
                  {new Date(e.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
