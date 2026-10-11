import { cn } from '@/lib/utils';
import type { Statut, StatutPresence } from '@/types';

export function StatutCompteBadge({ statut }: { statut: Statut }) {
  const actif = statut === 'active';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium tabular-nums',
        actif ? 'text-present bg-present-bg' : 'text-absent bg-absent-bg',
      )}
    >
      {actif ? 'Actif' : 'Suspendu'}
    </span>
  );
}

const presenceConfig: Record<StatutPresence, { label: string; className: string }> = {
  present: { label: 'Présent', className: 'text-present bg-present-bg' },
  late: { label: 'Retard', className: 'text-late bg-late-bg' },
  absent: { label: 'Absent', className: 'text-absent bg-absent-bg' },
  excused: { label: 'Rejeté', className: 'text-ink-faint bg-ink/5' },
};

export function StatutPresenceBadge({ statut }: { statut: StatutPresence }) {
  const c = presenceConfig[statut];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium tabular-nums',
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}

export function TypeSalleBadge({ type }: { type: 'CM' | 'TD' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium',
        type === 'CM' ? 'text-gold-deep bg-gold-soft' : 'text-ink-soft bg-ink/5',
      )}
    >
      {type === 'CM' ? 'CM · Amphi' : 'TD'}
    </span>
  );
}

const ROLE_STYLE: Record<string, string> = {
  SUPER_ADMIN: 'text-gold-deep bg-gold-soft',
  ADMIN: 'text-ink bg-ink/10',
  OBSERVATEUR: 'text-ink-faint bg-ink/5',
};

export function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium',
        ROLE_STYLE[role] ?? 'text-ink-soft bg-ink/5',
      )}
    >
      {role}
    </span>
  );
}

export function ConflitBadge() {
  return (
    <span className="inline-flex items-center rounded-sm bg-absent-bg px-2 py-0.5 text-xs font-medium text-absent">
      Conflit
    </span>
  );
}
