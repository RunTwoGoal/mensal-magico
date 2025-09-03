import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessTokenInMemory } from "../api";

/** Tipos */
export type User = {
  id?: string;
  email: string;
  name: string;
  created_at?: string;
};

type RegisterPayload = { name: string; email: string; password: string };
type LoginPayload = { email: string; password: string };

type AuthState = {
  user: User | null;
  token: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  register: (p: RegisterPayload) => Promise<void>;
  login: (p: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, token: null });

  /**
   * Boot da sessão SEM refresh:
   * - Carrega access_token e user do localStorage
   * - Injeta token em memória para o axios (api.ts)
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setAccessTokenInMemory(storedToken);
    }
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        setState({ user: parsed, token: storedToken });
      } catch {
        setState({ user: null, token: storedToken });
      }
    } else {
      setState((s) => ({ ...s, token: storedToken }));
    }
  }, []);

  /**
   * Registro:
   * - POST /auth/register -> { ok, user, token_type, access_token }
   * - Salva access_token + user no localStorage e no estado
   */
  const register = async (payload: RegisterPayload) => {
    const { data } = await api.post("/auth/register", payload);

    const access = data?.access_token as string | undefined;
    const user = data?.user as User | undefined;
    if (!access || !user) throw new Error("Resposta inválida do /auth/register");

    localStorage.setItem("access_token", access);
    localStorage.setItem("user", JSON.stringify(user));

    setAccessTokenInMemory(access);
    setState({ user, token: access });
  };

  /**
   * Login (OAuth2PasswordRequestForm):
   * - POST /auth/login (form-urlencoded: username/password)
   * - Resposta: { ok, user, token_type, access_token }
   */
  const login = async (payload: LoginPayload) => {
    const form = new URLSearchParams();
    form.append("username", payload.email);
    form.append("password", payload.password);

    const { data } = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const access = data?.access_token as string | undefined;
    const user = data?.user as User | undefined;
    if (!access || !user) throw new Error("Resposta inválida do /auth/login");

    localStorage.setItem("access_token", access);
    localStorage.setItem("user", JSON.stringify(user));

    setAccessTokenInMemory(access);
    setState({ user, token: access });
  };

  /**
   * Logout:
   * - Remove access_token e user do localStorage
   * - Limpa token em memória e estado
   */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setAccessTokenInMemory(null);
    setState({ user: null, token: null });
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: !!state.token,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};