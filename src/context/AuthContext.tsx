import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, clearToken, getToken, setToken } from '@/lib/api';
import type { Admin } from '@/types';

interface AuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function chargerProfil() {
    try {
      const { data } = await api.get<Admin>('/admin/auth/me');
      setAdmin(data);
    } catch {
      clearToken();
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (getToken()) {
      chargerProfil();
    } else {
      setIsLoading(false);
    }
  }, []);

  async function connexion(email: string, motDePasse: string) {
    const { data } = await api.post<{ accessToken: string; admin: Admin }>(
      '/admin/auth/login',
      { email, password: motDePasse },
    );
    setToken(data.accessToken);
    await chargerProfil();
  }

  function deconnexion() {
    clearToken();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider
      value={{ admin, isLoading, isAuthenticated: !!admin, connexion, deconnexion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}
