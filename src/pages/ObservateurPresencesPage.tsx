import { useState } from 'react';
import { Download, ListChecks } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { StatutPresenceBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import { messageErreur } from '@/lib/api';
import { useAttendancesAdmin } from '@/hooks/usePresenceQr';
import { useTelechargerPresences } from '@/hooks/useReports';

const STATUTS = [
  { value: '', label: 'Tous statuts' },
  { value: 'present', label: 'Présent' },
  { value: 'late', label: 'Retard' },
  { value: 'absent', label: 'Absent' },
  { value: 'excused', label: 'Rejeté' },
];

export default function ObservateurPresencesPage() {
  const [statut, setStatut] = useState('');
  const [du, setDu] = useState('');
  const [au, setAu] = useState('');
  const { data, isLoading } = useAttendancesAdmin({ status: statut || undefined });
  const telecharger = useTelechargerPresences();
  const [erreur, setErreur] = useState<string | null>(null);

  async function onTelecharger() {
    setErreur(null);
    try {
      await telecharger.mutateAsync({ from: du || undefined, to: au || undefined });
    } catch (err) {
      setErreur(messageErreur(err, 'Le téléchargement a échoué.'));
    }
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs text-ink-faint">Du</label>
          <Input type="date" value={du} onChange={(e) => setDu(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-faint">Au</label>
          <Input type="date" value={au} onChange={(e) => setAu(e.target.value)} />
        </div>
        <Button
          variant="secondary"
          onClick={onTelecharger}
          disabled={telecharger.isPending}
          className="ml-auto"
        >
          <Download className="h-4 w-4" />
          {telecharger.isPending ? 'Génération…' : 'Télécharger la fiche (CSV)'}
        </Button>
      </Card>
      {erreur && <p className="text-sm text-absent">{erreur}</p>}

      <Select className="max-w-xs" value={statut} onChange={(e) => setStatut(e.target.value)}>
        {STATUTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      {isLoading ? (
        <PageLoader />
      ) : !data?.length ? (
        <EmptyState icon={ListChecks} title="Aucun enregistrement" />
      ) : (
        <Card className="p-0">
          {data.map((r: any) => (
            <div key={r.id} className="ledger-row px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{r.studentName}</p>
                <p className="truncate text-xs text-ink-faint">
                  {r.studentMatricule} · {r.subjectName} · {r.className} · {r.date} {r.time}
                </p>
              </div>
              <StatutPresenceBadge statut={r.status} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
