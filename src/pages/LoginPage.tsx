import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { messageErreur } from '@/lib/api';

export default function LoginPage() {
  const { connexion, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    setEnCours(true);
    try {
      await connexion(email, motDePasse);
    } catch (err) {
      setErreur(messageErreur(err, 'Identifiants incorrects.'));
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <ShieldCheck className="mb-3 h-9 w-9 text-gold-deep" strokeWidth={1.5} />
          <h1 className="font-display text-2xl text-ink">Registre</h1>
          <p className="mt-1 text-sm text-ink-faint">Espace administrateur</p>
        </div>

        <form onSubmit={onSubmit} className="ledger-card p-6">
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@univ-plateau.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          {erreur && (
            <p className="mb-4 rounded-sm bg-absent-bg px-3 py-2 text-sm text-absent">{erreur}</p>
          )}

          <Button type="submit" className="w-full" disabled={enCours}>
            {enCours ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
}
