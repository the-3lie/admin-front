import { Users, GraduationCap, Layers, ShieldAlert, CalendarX2, UserX } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';

function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-faint">{label}</p>
          <p className="mt-1 font-display text-2xl text-ink">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-ink-faint" strokeWidth={1.5} />
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) return <PageLoader />;

  const alerts = data.alerts ?? {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Étudiants actifs" value={data.totalStudents ?? 0} icon={GraduationCap} />
        <Stat label="Enseignants actifs" value={data.totalTeachers ?? 0} icon={Users} />
        <Stat label="Classes" value={data.totalClasses ?? 0} icon={Layers} />
        <Stat
          label="Taux de présence (jour)"
          value={`${data.attendanceRate ?? 0}%`}
          icon={ShieldAlert}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Séances du jour</CardTitle>
          </CardHeader>
          <p className="font-display text-3xl text-ink">{data.todaySessions ?? 0}</p>
          <p className="mt-1 text-sm text-ink-faint">
            {data.presentToday ?? 0} présents · {data.absentToday ?? 0} absents
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fraude</CardTitle>
          </CardHeader>
          <p className="font-display text-3xl text-ink">{data.fraud?.openAlerts ?? 0}</p>
          <p className="mt-1 text-sm text-ink-faint">
            alerte(s) ouverte(s) · indice de risque {data.fraud?.riskIndex ?? 0}/100
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Points d'attention</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="ledger-row">
            <span className="flex items-center gap-2 text-sm text-ink-soft">
              <CalendarX2 className="h-4 w-4" /> Conflits d'emploi du temps
            </span>
            <span className="font-display text-lg">{alerts.scheduleConflicts ?? 0}</span>
          </div>
          <div className="ledger-row">
            <span className="flex items-center gap-2 text-sm text-ink-soft">
              <Users className="h-4 w-4" /> Classes sans chef
            </span>
            <span className="font-display text-lg">{alerts.classesWithoutLeader ?? 0}</span>
          </div>
          <div className="ledger-row">
            <span className="flex items-center gap-2 text-sm text-ink-soft">
              <UserX className="h-4 w-4" /> Comptes étudiants suspendus
            </span>
            <span className="font-display text-lg">{alerts.suspendedStudents ?? 0}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
