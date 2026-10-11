import { useState } from 'react';
import { Plus, Trash2, Pencil, DoorOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { TypeSalleBadge, ConflitBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/Spinner';
import { messageErreur } from '@/lib/api';
import {
  useSalles,
  useCreerSalle,
  useModifierSalle,
  useSupprimerSalle,
  useCreneaux,
  useCreerCreneau,
  useModifierCreneau,
  useSupprimerCreneau,
  useClasses,
  useSubjects,
  useEnseignantsListe,
} from '@/hooks/useSchedule';
import type { Creneau, Salle, TypeSalle } from '@/types';

const JOURS = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function EmploiDuTempsPage() {
  const [onglet, setOnglet] = useState<'emploi' | 'salles'>('emploi');

  return (
    <div className="space-y-5">
      <div className="flex gap-1 border-b border-line">
        <button
          onClick={() => setOnglet('emploi')}
          className={`px-3 py-2.5 text-sm font-medium ${onglet === 'emploi' ? 'border-b-2 border-ink text-ink' : 'text-ink-faint hover:text-ink-soft'}`}
        >
          Emploi du temps
        </button>
        <button
          onClick={() => setOnglet('salles')}
          className={`px-3 py-2.5 text-sm font-medium ${onglet === 'salles' ? 'border-b-2 border-ink text-ink' : 'text-ink-faint hover:text-ink-soft'}`}
        >
          Salles
        </button>
      </div>

      {onglet === 'emploi' ? <OngletEmploi /> : <OngletSalles />}
    </div>
  );
}

/* ------------------------------- Emploi du temps ----------------------------- */

function OngletEmploi() {
  const [classeId, setClasseId] = useState<string>('');
  const { data: classes } = useClasses();
  const { data: subjects } = useSubjects();
  const { data: enseignants } = useEnseignantsListe();
  const { data: salles } = useSalles();
  const { data: creneaux, isLoading } = useCreneaux(classeId || undefined);
  const creerCreneau = useCreerCreneau();
  const modifierCreneau = useModifierCreneau();
  const supprimerCreneau = useSupprimerCreneau();
  const [modalOuvert, setModalOuvert] = useState(false);
  const [enEdition, setEnEdition] = useState<Creneau | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [typeChoisi, setTypeChoisi] = useState<TypeSalle>('TD');

  const sallesFiltrees = (salles ?? []).filter((s) => s.type === typeChoisi);

  function ouvrirCreation() {
    setEnEdition(null);
    setTypeChoisi('TD');
    setModalOuvert(true);
  }

  function ouvrirEdition(c: Creneau) {
    setEnEdition(c);
    setTypeChoisi(c.sessionType);
    setModalOuvert(true);
  }

  async function onValider(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    const dto = {
      classId: String(fd.get('classId')),
      subjectId: String(fd.get('subjectId')),
      teacherId: String(fd.get('teacherId')),
      roomId: String(fd.get('roomId')),
      sessionType: typeChoisi,
      dayOfWeek: Number(fd.get('dayOfWeek')),
      startTime: String(fd.get('startTime')),
      endTime: String(fd.get('endTime')),
    };
    try {
      if (enEdition) {
        await modifierCreneau.mutateAsync({ id: enEdition.id, ...dto });
      } else {
        await creerCreneau.mutateAsync(dto);
      }
      setModalOuvert(false);
    } catch (err) {
      setErreur(messageErreur(err));
    }
  }

  const enCours = creerCreneau.isPending || modifierCreneau.isPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          className="max-w-xs"
          value={classeId}
          onChange={(e) => setClasseId(e.target.value)}
        >
          <option value="">Toutes les classes</option>
          {classes?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Button onClick={ouvrirCreation}>
          <Plus className="h-4 w-4" /> Ajouter un créneau
        </Button>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : !creneaux?.length ? (
        <EmptyState icon={DoorOpen} title="Aucun créneau" />
      ) : (
        <Card className="p-0">
          {creneaux.map((c) => (
            <div key={c.id} className="ledger-row px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {c.subjectName} · {c.className}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {c.day} {c.startTime}–{c.endTime} · {c.teacherName} · {c.room.name}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <TypeSalleBadge type={c.sessionType} />
                {c.hasConflict && <ConflitBadge />}
                <button
                  title="Modifier ce créneau"
                  onClick={() => ouvrirEdition(c)}
                  className="text-ink-faint hover:text-ink"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  title="Supprimer ce créneau"
                  onClick={() => supprimerCreneau.mutate(c.id)}
                  className="text-ink-faint hover:text-absent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {c.hasConflict && c.conflictReason && (
                <p className="basis-full pt-1 text-xs text-absent">{c.conflictReason}</p>
              )}
            </div>
          ))}
        </Card>
      )}

      {modalOuvert && (
        <Modal
          title={enEdition ? 'Modifier le créneau' : 'Nouveau créneau'}
          onClose={() => setModalOuvert(false)}
        >
          <form onSubmit={onValider} className="space-y-3">
            <Select name="classId" required defaultValue={enEdition?.classId ?? ''}>
              <option value="" disabled>
                Classe…
              </option>
              {classes?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select name="subjectId" required defaultValue={enEdition?.subjectId ?? ''}>
              <option value="" disabled>
                Matière…
              </option>
              {subjects?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Select name="teacherId" required defaultValue={enEdition?.teacherId ?? ''}>
              <option value="" disabled>
                Enseignant…
              </option>
              {enseignants?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </Select>

            <div>
              <Label>Type de cours</Label>
              <div className="flex gap-2">
                {(['CM', 'TD'] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTypeChoisi(t)}
                    className={`flex-1 rounded border px-3 py-2 text-sm ${typeChoisi === t ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft'}`}
                  >
                    {t === 'CM' ? 'CM (amphi)' : 'TD'}
                  </button>
                ))}
              </div>
            </div>

            <Select
              name="roomId"
              required
              defaultValue={enEdition?.sessionType === typeChoisi ? enEdition.room.id : ''}
              key={typeChoisi}
            >
              <option value="" disabled>
                Salle ({typeChoisi})…
              </option>
              {sallesFiltrees.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.capacity} places)
                </option>
              ))}
            </Select>
            {!sallesFiltrees.length && (
              <p className="text-xs text-late">
                Aucune salle de type {typeChoisi} — crée-en une dans l'onglet Salles.
              </p>
            )}

            <Select name="dayOfWeek" required defaultValue={enEdition?.dayOfWeek ?? ''}>
              <option value="" disabled>
                Jour…
              </option>
              {JOURS.slice(1).map((j, i) => (
                <option key={j} value={i + 1}>
                  {j}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Input name="startTime" type="time" defaultValue={enEdition?.startTime} required />
              <Input name="endTime" type="time" defaultValue={enEdition?.endTime} required />
            </div>

            {erreur && <p className="text-sm text-absent">{erreur}</p>}
            <Button type="submit" className="w-full" disabled={enCours}>
              {enEdition ? 'Enregistrer les modifications' : 'Ajouter le créneau'}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ----------------------------------- Salles ---------------------------------- */

function OngletSalles() {
  const { data, isLoading } = useSalles();
  const creer = useCreerSalle();
  const modifier = useModifierSalle();
  const supprimer = useSupprimerSalle();
  const [modalOuvert, setModalOuvert] = useState(false);
  const [enEdition, setEnEdition] = useState<Salle | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  function ouvrirCreation() {
    setEnEdition(null);
    setModalOuvert(true);
  }

  function ouvrirEdition(s: Salle) {
    setEnEdition(s);
    setModalOuvert(true);
  }

  async function onValider(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur(null);
    const fd = new FormData(e.currentTarget);
    const dto = {
      name: String(fd.get('name')),
      type: String(fd.get('type')) as TypeSalle,
      capacity: Number(fd.get('capacity')),
    };
    try {
      if (enEdition) {
        await modifier.mutateAsync({ id: enEdition.id, ...dto });
      } else {
        await creer.mutateAsync(dto);
      }
      setModalOuvert(false);
    } catch (err) {
      setErreur(messageErreur(err));
    }
  }

  async function onSupprimer(id: string) {
    try {
      await supprimer.mutateAsync(id);
    } catch (err) {
      alert(messageErreur(err));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-faint">
          Un amphi (CM) ne peut pas accueillir un cours de TD, et inversement — c'est vérifié à
          la pose du créneau.
        </p>
        <Button onClick={ouvrirCreation}>
          <Plus className="h-4 w-4" /> Nouvelle salle
        </Button>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : !data?.length ? (
        <EmptyState icon={DoorOpen} title="Aucune salle" description="Ajoute la première salle de l'établissement." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((s) => (
            <Card key={s.id} className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-ink">{s.name}</p>
                <p className="text-xs text-ink-faint">{s.capacity} places</p>
              </div>
              <div className="flex items-center gap-2">
                <TypeSalleBadge type={s.type} />
                <button
                  title="Modifier"
                  onClick={() => ouvrirEdition(s)}
                  className="text-ink-faint hover:text-ink"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  title={
                    s.creneauxCount > 0
                      ? `Utilisée par ${s.creneauxCount} créneau(x)`
                      : 'Supprimer'
                  }
                  onClick={() => onSupprimer(s.id)}
                  className="text-ink-faint hover:text-absent"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {modalOuvert && (
        <Modal
          title={enEdition ? 'Modifier la salle' : 'Nouvelle salle'}
          onClose={() => setModalOuvert(false)}
        >
          <form onSubmit={onValider} className="space-y-3">
            <Input
              name="name"
              placeholder="Nom (ex. Amphi A, B204)"
              defaultValue={enEdition?.name}
              required
            />
            <Select name="type" defaultValue={enEdition?.type ?? 'TD'}>
              <option value="CM">CM (amphi)</option>
              <option value="TD">TD</option>
            </Select>
            <Input
              name="capacity"
              type="number"
              min={1}
              placeholder="Capacité"
              defaultValue={enEdition?.capacity}
              required
            />
            {enEdition && enEdition.creneauxCount > 0 && (
              <p className="text-xs text-late">
                Cette salle est utilisée par {enEdition.creneauxCount} créneau(x) — changer son
                type peut créer un conflit avec ces créneaux.
              </p>
            )}
            {erreur && <p className="text-sm text-absent">{erreur}</p>}
            <Button type="submit" className="w-full" disabled={creer.isPending || modifier.isPending}>
              {enEdition ? 'Enregistrer les modifications' : 'Créer la salle'}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
