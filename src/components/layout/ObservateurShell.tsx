import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Volontairement différente de l'AppShell (pas de barre latérale, pas de
 * navigation) : un observateur n'a qu'une seule chose à faire ici, la page
 * ne doit ni suggérer ni permettre autre chose. C'est la même logique que
 * côté serveur (liste blanche stricte dans AdminRolesGuard), transposée à
 * l'interface : même en modifiant l'URL à la main, il n'y a nulle part
 * d'autre où aller.
 */
export function ObservateurShell({ children }: { children: ReactNode }) {
  const { admin, deconnexion } = useAuth();

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3.5 md:px-8">
        <div className="flex items-center gap-2.5">
          <Eye className="h-5 w-5 text-gold-deep" strokeWidth={1.75} />
          <div>
            <p className="font-display text-base leading-tight">Registre</p>
            <p className="text-xs text-ink-faint">
              Observateur — {admin?.firstName} {admin?.lastName}
            </p>
          </div>
        </div>
        <button
          onClick={deconnexion}
          className="text-xs text-ink-faint underline decoration-dotted underline-offset-2 hover:text-ink"
        >
          Se déconnecter
        </button>
      </header>
      <main className="px-4 py-6 md:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <h1 className="mb-5 font-display text-xl text-ink md:text-2xl">
            Registre des présences
          </h1>
          {children}
        </div>
      </main>
    </div>
  );
}
