import { useState } from 'react';
import { ShieldAlert, PlayCircle, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import { useFraudAlerts, useFraudStats, useLancerDetectionFraude, useTraiterAlerte } from '@/hooks/useFraud';

const SEVERITE_STYLE: Record<string, string> = {
  LOW: 'text-ink-soft bg-ink/5',
  MEDIUM: 'text-late bg-late-bg',
  HIGH: 'text-absent bg-absent-bg',
  CRITICAL: 'text-white bg-absent',
};

export default function FraudePage() {
  const [statut, setStatut] = useState('OPEN');
  const { data: stats } = useFraudStats();
  const { data: alertes, isLoading } = useFraudAlerts({ status: statut || undefined });
  const lancer = useLancerDetectionFraude();
  const traiter = useTraiterAlerte();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-ink-faint">Alertes ouvertes</p>
          <p className="font-display text-2xl text-ink">{stats?.ouvertes ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-faint">Indice de risque</p>
          <p className="font-display text-2xl text-ink">{stats?.indiceRisque ?? 0}/100</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-faint">Étudiants concernés</p>
          <p className="font-display text-2xl text-ink">{stats?.etudiantsConcernes ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-faint">7 derniers jours</p>
          <p className="font-display text-2xl text-ink">{stats?.derniers7Jours ?? 0}</p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select className="max-w-xs" value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="OPEN">Ouvertes</option>
          <option value="CONFIRMED">Confirmées</option>
          <option value="DISMISSED">Écartées</option>
          <option value="RESOLVED">Résolues</option>
          <option value="">Toutes</option>
        </Select>
        <Button variant="secondary" onClick={() => lancer.mutate()} disabled={lancer.isPending}>
          <PlayCircle className="h-4 w-4" />
          {lancer.isPending ? 'Analyse en cours…' : 'Lancer une détection'}
        </Button>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : !alertes?.length ? (
        <EmptyState icon={ShieldAlert} title="Aucune alerte" />
      ) : (
        <Card className="p-0">
          {alertes.map((a: any) => (
            <div key={a.id} className="ledger-row items-start px-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${SEVERITE_STYLE[a.severity] ?? ''}`}
                  >
                    {a.severity}
                  </span>
                  <p className="truncate text-sm font-medium text-ink">{a.title}</p>
                </div>
                <p className="mt-1 text-xs text-ink-faint">{a.description}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {a.student?.name} ({a.student?.matricule}) · {a.session?.subjectName} ·{' '}
                  {a.session?.date}
                </p>
              </div>
              {a.status === 'OPEN' && (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    title="Confirmer la fraude"
                    onClick={() => traiter.mutate({ id: a.id, status: 'CONFIRMED' })}
                    className="text-ink-faint hover:text-absent"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    title="Écarter l'alerte"
                    onClick={() => traiter.mutate({ id: a.id, status: 'DISMISSED' })}
                    className="text-ink-faint hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
