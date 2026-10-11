import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MOBILE_NAV_ITEMS } from './nav-items';

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {MOBILE_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px]',
              isActive ? 'text-ink' : 'text-ink-faint',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
              {label === 'Tableau de bord' ? 'Accueil' : label.split(' ')[0]}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
