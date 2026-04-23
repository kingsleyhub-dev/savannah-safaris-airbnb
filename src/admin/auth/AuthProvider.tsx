import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { ADMIN_PORTAL_ROLES, hasRequiredRole, type AdminRole } from "./permissions";

type Role = AdminRole;

interface AuthCtx {
  user: User | null;
  session: Session | null;
  roles: Role[];
  loading: boolean;
  rolesLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);

  const loadRoles = async (uid: string) => {
    setRolesLoading(true);
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r: { role: Role }) => r.role));
    setRolesLoading(false);
  };

  useEffect(() => {
    // 1. Subscribe FIRST so we never miss an event
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // Defer to avoid deadlocks inside the callback
        setTimeout(() => loadRoles(s.user.id), 0);
      } else {
        setRoles([]);
        setRolesLoading(false);
      }
    });

    // 2. Then read existing session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadRoles(s.user.id);
      else setRolesLoading(false);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    return { error: error?.message };
  };

  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = hasRequiredRole(roles, ADMIN_PORTAL_ROLES);

  return (
    <Ctx.Provider value={{ user, session, roles, loading, rolesLoading, isAdmin, isSuperAdmin, signIn, signOut, resetPassword }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
