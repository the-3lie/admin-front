import { NavLink } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { cn, initiales } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const { admin, deconnexion } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface md:flex">
      <div className="flex items-center gap-2.5 border-b border-line px-6 py-5">
        <ShieldCheck className="h-6 w-6 text-gold-deep" strokeWidth={1.75} />
        <div>
          <p className="font-display text-base leading-tight">Registre</p>
          <p className="text-xs text-ink-faint">Espace administrateur</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-ink text-paper'
                  : 'text-ink-soft hover:bg-ink/5 hover:text-ink',
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft font-display text-sm text-gold-deep">
            {admin ? initiales(admin.firstName, admin.lastName) : ''}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {admin?.firstName} {admin?.lastName}
            </p>
            <p className="truncate text-xs text-ink-faint">{admin?.role}</p>
          </div>
        </div>
        <button
          onClick={deconnexion}
          className="mt-3 text-xs text-ink-faint underline decoration-dotted underline-offset-2 hover:text-ink"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
