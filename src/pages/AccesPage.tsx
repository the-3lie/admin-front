import { useState } from 'react';
import { Plus, KeyRound, Ban, CheckCircle2, Search, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { StatutCompteBadge, RoleBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import { messageErreur } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  useEtudiants,
  useCreerEtudiant,
  useSuspendreEtudiant,
  useResetMotDePasseEtudiant,
  useEnseignants,
  useCreerEnseignant,
  useSuspendreEnseignant,
  useResetMotDePasseEnseignant,
  useChefsClasse,
  useAdmins,
  useCreerAdmin,
  useSuspendreAdmin,
  useResetMotDePasseAdmin,
} from '@/hooks/useAccess';
import { useClasses } from '@/hooks/useSchedule';
import type { RoleAdmin } from '@/types';

const ONGLETS = ['Étudiants', 'Enseignants', 'Chefs de classe', 'Administrateurs'] as const;
type Onglet = (typeof ONGLETS)[number];

export default function AccesPage() {
  const [onglet, setOnglet] = useState<Onglet>('Étudiants');

  return (
    <div className="space-y-5">
      <div className="flex gap-1 overflow-x-auto border-b border-line">
        {ONGLETS.map((o) => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className={`whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors ${
              onglet === o
                ? 'border-b-2 border-ink text-ink'
                : 'text-ink-faint hover:text-ink-soft'
            }`}
          >
            {o}
          </button>
        ))}
      </div>

      {onglet === 'Étudiants' && <OngletEtudiants />}
      {onglet === 'Enseignants' && <OngletEnseignants />}
      {onglet === 'Chefs de classe' && <OngletChefsClasse />}
      {onglet === 'Administrateurs' && <OngletAdmins />}
    </div>
  );
}

/* Bandeau : mot de passe temporaire affiché une seule fois après une action. */
function BandeauMotDePasse({ mdp, onClose }: { mdp: string; onClose: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded border border-gold-soft bg-gold-soft/40 px-4 py-3 text-sm">
      <span>
        Mot de passe temporaire : <strong className="font-mono">{mdp}</strong> — à transmettre à
        la personne concernée, il ne sera plus affiché.
      </span>
      <button onClick={onClose} className="text-ink-faint hover:text-ink">
        ✕
      </button>
    </div>
  );
}

/* --------------------------------- Étudiants -------------------------------- */

function OngletEtudiants() {
  const [recherche, setRecherche] = useState('');
  const { data, isLoading } = useEtudiants(recherche || undefined);
  const { data: classes } = useClasses();
  const creer = useCreerEtudiant();
  const suspendre = useSuspendreEtudiant();
  const resetMdp = useResetMotDePasseEtudiant();
  const [modalOuvert, setModalOuvert] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [mdpAffiche, setMdpAffiche] = useState<string | null>(null);

  async function onCreer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    try {
      await creer.mutateAsync({
        matricule: String(fd.get('matricule')),
        firstName: String(fd.get('firstName')),
        lastName: String(fd.get('lastName')),
        email: String(fd.get('email')),
        classId: String(fd.get('classId')),
      });
      setModalOuvert(false);
    } catch (err) {
      setErreur(messageErreur(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            placeholder="Rechercher (nom, matricule, email)…"
            className="pl-9"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <Button onClick={() => setModalOuvert(true)}>
          <Plus className="h-4 w-4" /> Nouvel étudiant
        </Button>
      </div>

      {mdpAffiche && <BandeauMotDePasse mdp={mdpAffiche} onClose={() => setMdpAffiche(null)} />}

      {isLoading ? (
        <PageLoader />
      ) : !data?.length ? (
        <EmptyState icon={Search} title="Aucun étudiant" />
      ) : (
        <Card className="p-0">
          {data.map((e) => (
            <div key={e.id} className="ledger-row px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {e.firstName} {e.lastName}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {e.matricule} · {e.className} · {e.email}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatutCompteBadge statut={e.status} />
                <button
                  title="Réinitialiser le mot de passe"
                  onClick={async () => {
                    const r = await resetMdp.mutateAsync(e.id);
                    if (r?.temporaryPassword) setMdpAffiche(r.temporaryPassword);
                  }}
                  className="text-ink-faint hover:text-ink"
                >
                  <KeyRound className="h-4 w-4" />
                </button>
                <button
                  title={e.status === 'active' ? 'Suspendre' : 'Réactiver'}
                  onClick={() =>
                    suspendre.mutate({ id: e.id, suspendre: e.status === 'active' })
                  }
                  className="text-ink-faint hover:text-ink"
                >
                  {e.status === 'active' ? (
                    <Ban className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {modalOuvert && (
        <Modal title="Nouvel étudiant" onClose={() => setModalOuvert(false)}>
          <form onSubmit={onCreer} className="space-y-3">
            <Input name="matricule" placeholder="Matricule" required />
            <div className="grid grid-cols-2 gap-3">
              <Input name="firstName" placeholder="Prénom" required />
              <Input name="lastName" placeholder="Nom" required />
            </div>
            <Input name="email" type="email" placeholder="Email" required />
            <Select name="classId" required defaultValue="">
              <option value="" disabled>
                Classe…
              </option>
              {classes?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            {erreur && <p className="text-sm text-absent">{erreur}</p>}
            <Button type="submit" className="w-full" disabled={creer.isPending}>
              Créer le compte
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------- Enseignants ------------------------------- */

function OngletEnseignants() {
  const [recherche, setRecherche] = useState('');
  const { data, isLoading } = useEnseignants(recherche || undefined);
  const creer = useCreerEnseignant();
  const suspendre = useSuspendreEnseignant();
  const resetMdp = useResetMotDePasseEnseignant();
  const [modalOuvert, setModalOuvert] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [mdpAffiche, setMdpAffiche] = useState<string | null>(null);

  async function onCreer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    try {
      await creer.mutateAsync({
        firstName: String(fd.get('firstName')),
        lastName: String(fd.get('lastName')),
        email: String(fd.get('email')),
        department: String(fd.get('department') || '') || undefined,
      });
      setModalOuvert(false);
    } catch (err) {
      setErreur(messageErreur(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            placeholder="Rechercher (nom, email)…"
            className="pl-9"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
        <Button onClick={() => setModalOuvert(true)}>
          <Plus className="h-4 w-4" /> Nouvel enseignant
        </Button>
      </div>

      {mdpAffiche && <BandeauMotDePasse mdp={mdpAffiche} onClose={() => setMdpAffiche(null)} />}

      {isLoading ? (
        <PageLoader />
      ) : !data?.length ? (
        <EmptyState icon={Search} title="Aucun enseignant" />
      ) : (
        <Card className="p-0">
          {data.map((t) => (
            <div key={t.id} className="ledger-row px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {t.firstName} {t.lastName}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {t.department || t.facultyName || '—'} · {t.email} · {t.subjectsCount} matière(s)
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatutCompteBadge statut={t.status} />
                <button
                  title="Réinitialiser le mot de passe"
                  onClick={async () => {
                    const r = await resetMdp.mutateAsync(t.id);
                    if (r?.temporaryPassword) setMdpAffiche(r.temporaryPassword);
                  }}
                  className="text-ink-faint hover:text-ink"
                >
                  <KeyRound className="h-4 w-4" />
                </button>
                <button
                  title={t.status === 'active' ? 'Suspendre' : 'Réactiver'}
                  onClick={() =>
                    suspendre.mutate({ id: t.id, suspendre: t.status === 'active' })
                  }
                  className="text-ink-faint hover:text-ink"
                >
                  {t.status === 'active' ? (
                    <Ban className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {modalOuvert && (
        <Modal title="Nouvel enseignant" onClose={() => setModalOuvert(false)}>
          <form onSubmit={onCreer} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input name="firstName" placeholder="Prénom" required />
              <Input name="lastName" placeholder="Nom" required />
            </div>
            <Input name="email" type="email" placeholder="Email" required />
            <Input name="department" placeholder="Département (optionnel)" />
            {erreur && <p className="text-sm text-absent">{erreur}</p>}
            <Button type="submit" className="w-full" disabled={creer.isPending}>
              Créer le compte
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------ Chefs de classe ------------------------------ */

function OngletChefsClasse() {
  const { data, isLoading } = useChefsClasse();

  if (isLoading) return <PageLoader />;
  if (!data?.length) return <EmptyState icon={Search} title="Aucune classe" />;

  return (
    <Card className="p-0">
      {data.map((c) => (
        <div key={c.classId} className="ledger-row px-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{c.className}</p>
            <p className="truncate text-xs text-ink-faint">
              {c.filiereName} · {c.level} · {c.studentCount} étudiant(s)
            </p>
          </div>
          <div className="shrink-0 text-right text-sm">
            {c.chief ? (
              <p className="text-ink">
                {c.chief.firstName} {c.chief.lastName}
              </p>
            ) : (
              <p className="text-ink-faint">Aucun chef désigné</p>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
}

/* ------------------------------ Administrateurs ------------------------------ */

function OngletAdmins() {
  const { admin: moi } = useAuth();
  const jeSuisSuperAdmin = moi?.role === 'SUPER_ADMIN';

  const { data, isLoading } = useAdmins();
  const creer = useCreerAdmin();
  const suspendre = useSuspendreAdmin();
  const resetMdp = useResetMotDePasseAdmin();
  const [modalOuvert, setModalOuvert] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [mdpAffiche, setMdpAffiche] = useState<string | null>(null);

  async function onCreer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    try {
      const r = await creer.mutateAsync({
        firstName: String(fd.get('firstName')),
        lastName: String(fd.get('lastName')),
        email: String(fd.get('email')),
        // Un ADMIN n'a que l'option OBSERVATEUR dans le formulaire (voir plus
        // bas) ; on force quand même la valeur ici par défense en profondeur —
        // c'est de toute façon revérifié et imposé côté serveur.
        role: jeSuisSuperAdmin ? (String(fd.get('role')) as RoleAdmin) : 'OBSERVATEUR',
      });
      setModalOuvert(false);
      if (r?.temporaryPassword) setMdpAffiche(r.temporaryPassword);
    } catch (err) {
      setErreur(messageErreur(err));
    }
  }

  // Un ADMIN ne peut agir que sur des comptes déjà OBSERVATEUR — les lignes
  // SUPER_ADMIN et ADMIN sont visibles (transparence) mais sans bouton
  // d'action pour lui. Un SUPER_ADMIN, lui, agit sur tout le monde.
  function peutGerer(cible: { role: RoleAdmin }) {
    return jeSuisSuperAdmin || cible.role === 'OBSERVATEUR';
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-faint">
          {jeSuisSuperAdmin
            ? 'Super administrateur : création et gestion de tous les comptes, y compris administrateur.'
            : "Administrateur : vous ne pouvez créer et gérer que des comptes observateur — la création d'un administrateur ou super administrateur est réservée au super administrateur."}
        </p>
        <Button onClick={() => setModalOuvert(true)}>
          <Plus className="h-4 w-4" /> {jeSuisSuperAdmin ? 'Nouvel administrateur' : 'Nouvel observateur'}
        </Button>
      </div>

      {mdpAffiche && <BandeauMotDePasse mdp={mdpAffiche} onClose={() => setMdpAffiche(null)} />}

      {isLoading ? (
        <PageLoader />
      ) : !data?.length ? (
        <EmptyState icon={Search} title="Aucun administrateur" />
      ) : (
        <Card className="p-0">
          {data.map((a) => (
            <div key={a.id} className="ledger-row px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {a.firstName} {a.lastName}
                </p>
                <p className="truncate text-xs text-ink-faint">{a.email}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <RoleBadge role={a.role} />
                <StatutCompteBadge statut={a.status} />
                {peutGerer(a) ? (
                  <>
                    <button
                      title="Réinitialiser le mot de passe"
                      onClick={async () => {
                        const r = await resetMdp.mutateAsync(a.id);
                        if (r?.temporaryPassword) setMdpAffiche(r.temporaryPassword);
                      }}
                      className="text-ink-faint hover:text-ink"
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                    <button
                      title={a.status === 'active' ? 'Suspendre' : 'Réactiver'}
                      onClick={() =>
                        suspendre.mutate({ id: a.id, suspendre: a.status === 'active' })
                      }
                      className="text-ink-faint hover:text-ink"
                    >
                      {a.status === 'active' ? (
                        <Ban className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </button>
                  </>
                ) : (
                  <span title="Réservé au super administrateur" className="text-ink-faint/40">
                    <Lock className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}

      {modalOuvert && (
        <Modal
          title={jeSuisSuperAdmin ? 'Nouvel administrateur' : 'Nouvel observateur'}
          onClose={() => setModalOuvert(false)}
        >
          <form onSubmit={onCreer} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input name="firstName" placeholder="Prénom" required />
              <Input name="lastName" placeholder="Nom" required />
            </div>
            <Input name="email" type="email" placeholder="Email" required />
            {jeSuisSuperAdmin ? (
              <Select name="role" defaultValue="ADMIN">
                <option value="ADMIN">Administrateur</option>
                <option value="OBSERVATEUR">Observateur (lecture seule)</option>
                <option value="SUPER_ADMIN">Super administrateur</option>
              </Select>
            ) : (
              <p className="rounded-sm bg-ink/5 px-3 py-2 text-sm text-ink-soft">
                Rôle : Observateur (lecture seule) — seul rôle qu'un administrateur peut créer.
              </p>
            )}
            {erreur && <p className="text-sm text-absent">{erreur}</p>}
            <Button type="submit" className="w-full" disabled={creer.isPending}>
              Créer le compte
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
