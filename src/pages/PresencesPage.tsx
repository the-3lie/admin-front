import { useState } from 'react';
import { RefreshCw, XCircle, QrCode, ListChecks, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { StatutPresenceBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import { messageErreur } from '@/lib/api';
import {
  useSessionsAdmin,
  useQrMonitor,
  useRelancerSession,
  useCloturerSession,
  useAttendancesAdmin,
  useCorrigerPresence,
} from '@/hooks/usePresenceQr';
import { useTelechargerPresences } from '@/hooks/useReports';
import { useClasses } from '@/hooks/useSchedule';

export default function PresencesPage() {
  const [onglet, setOnglet] = useState<'qr' | 'presences'>('qr');

  return (
    <div className="space-y-5">
      <div className="flex gap-1 border-b border-line">
        <button
          onClick={() => setOnglet('qr')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium ${onglet === 'qr' ? 'border-b-2 border-ink text-ink' : 'text-ink-faint hover:text-ink-soft'}`}
        >
          <QrCode className="h-4 w-4" /> Séances & QR en direct
        </button>
        <button
          onClick={() => setOnglet('presences')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium ${onglet === 'presences' ? 'border-b-2 border-ink text-ink' : 'text-ink-faint hover:text-ink-soft'}`}
        >
          <ListChecks className="h-4 w-4" /> Registre des présences
        </button>
      </div>

      {onglet === 'qr' ? <OngletQr /> : <OngletPresences />}
    </div>
  );
}

/* --------------------------------- QR en direct ------------------------------ */

function OngletQr() {
  const { data: qr, isLoading } = useQrMonitor();
  const { data: sessions } = useSessionsAdmin({ status: 'active' });
  const relancer = useRelancerSession();
  const cloturer = useCloturerSession();

  if (isLoading) return <PageLoader />;
  if (!qr?.length) return <EmptyState icon={QrCode} title="Aucune séance aujourd'hui" />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-faint">
        Mise à jour automatique toutes les 10 secondes. {sessions?.length ?? 0} séance(s)
        active(s) en ce moment.
      </p>
      <Card className="p-0">
        {qr.map((s: any) => (
          <div key={s.sessionId} className="ledger-row px-5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {s.courseName} · {s.className}
              </p>
              <p className="truncate text-xs text-ink-faint">
                {s.teacherName} · salle {s.room} · {s.startTime}–{s.endTime}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <span className="text-xs text-ink-faint">
                {s.status === 'active'
                  ? `QR actif — ${Math.floor(s.secondsRemaining / 60)} min restantes`
                  : s.status === 'pending'
                    ? 'Pas encore démarrée'
                    : s.status}
              </span>
              <button
                title="Relancer / prolonger le QR"
                onClick={() => relancer.mutate(s.sessionId)}
                className="text-ink-faint hover:text-ink"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              {s.status === 'active' && (
                <button
                  title="Clôturer la séance"
                  onClick={() => cloturer.mutate(s.sessionId)}
                  className="text-ink-faint hover:text-absent"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ------------------------------ Registre des présences ----------------------- */

const STATUTS = [
  { value: '', label: 'Tous statuts' },
  { value: 'present', label: 'Présent' },
  { value: 'late', label: 'Retard' },
  { value: 'absent', label: 'Absent' },
  { value: 'excused', label: 'Rejeté' },
];

function OngletPresences() {
  const [statut, setStatut] = useState('');
  const { data, isLoading } = useAttendancesAdmin({ status: statut || undefined });
  const corriger = useCorrigerPresence();
  const { data: classes } = useClasses();
  const [classeId, setClasseId] = useState('');
  const [du, setDu] = useState('');
  const [au, setAu] = useState('');
  const telecharger = useTelechargerPresences();
  const [erreurTelechargement, setErreurTelechargement] = useState<string | null>(null);

  async function onTelecharger() {
    setErreurTelechargement(null);
    try {
      await telecharger.mutateAsync({
        classId: classeId || undefined,
        from: du || undefined,
        to: au || undefined,
      });
    } catch (err) {
      setErreurTelechargement(messageErreur(err, 'Le téléchargement a échoué.'));
    }
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-end gap-3 p-4">
        <div>
          <label className="mb-1 block text-xs text-ink-faint">Classe</label>
          <Select value={classeId} onChange={(e) => setClasseId(e.target.value)}>
            <option value="">Toutes les classes</option>
            {classes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
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
      {erreurTelechargement && <p className="text-sm text-absent">{erreurTelechargement}</p>}

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
                  {r.corrected && ' · corrigé'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatutPresenceBadge statut={r.status} />
                <Select
                  className="w-auto py-1 text-xs"
                  value={r.status === 'excused' ? 'rejected' : r.status}
                  onChange={(e) => corriger.mutate({ id: r.id, status: e.target.value })}
                >
                  <option value="present">Présent</option>
                  <option value="late">Retard</option>
                  <option value="absent">Absent</option>
                  <option value="rejected">Rejeté</option>
                </Select>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
