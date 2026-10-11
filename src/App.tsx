import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from '@/components/RequireAuth';
import { AppShell } from '@/components/layout/AppShell';
import { ObservateurShell } from '@/components/layout/ObservateurShell';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AccesPage from '@/pages/AccesPage';
import EmploiDuTempsPage from '@/pages/EmploiDuTempsPage';
import PresencesPage from '@/pages/PresencesPage';
import FraudePage from '@/pages/FraudePage';
import JournalPage from '@/pages/JournalPage';
import ObservateurPresencesPage from '@/pages/ObservateurPresencesPage';

/**
 * Deux plateformes distinctes derrière la même authentification :
 * - OBSERVATEUR atterrit systématiquement sur ObservateurShell, quelle
 *   que soit l'URL demandée — il n'y a nulle part ailleurs où aller,
 *   ce qui reflète côté interface la liste blanche stricte appliquée
 *   côté serveur (AdminRolesGuard). Une URL tapée à la main pour
 *   /acces, /journal, etc. ramène ici plutôt que d'afficher un
 *   fragment d'écran cassé par des 403 en boucle.
 * - SUPER_ADMIN et ADMIN partagent la même coquille opérationnelle
 *   (AppShell) ; leurs différences de droits se jouent à l'intérieur
 *   des pages (ex. l'onglet Administrateurs), pas dans la navigation.
 */
function Protected({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RoleGate title={title}>{children}</RoleGate>
    </RequireAuth>
  );
}

function RoleGate({ title, children }: { title: string; children: React.ReactNode }) {
  const { admin } = useAuth();

  if (admin?.role === 'OBSERVATEUR') {
    return (
      <ObservateurShell>
        <ObservateurPresencesPage />
      </ObservateurShell>
    );
  }

  return <AppShell title={title}>{children}</AppShell>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Protected title="Tableau de bord">
            <DashboardPage />
          </Protected>
        }
      />
      <Route
        path="/acces"
        element={
          <Protected title="Accès & utilisateurs">
            <AccesPage />
          </Protected>
        }
      />
      <Route
        path="/emploi-du-temps"
        element={
          <Protected title="Emploi du temps & salles">
            <EmploiDuTempsPage />
          </Protected>
        }
      />
      <Route
        path="/presences"
        element={
          <Protected title="Présences & QR">
            <PresencesPage />
          </Protected>
        }
      />
      <Route
        path="/fraude"
        element={
          <Protected title="Fraude">
            <FraudePage />
          </Protected>
        }
      />
      <Route
        path="/journal"
        element={
          <Protected title="Journal d'activité">
            <JournalPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
