import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/lib/supabase/database.types";

export type AppRole = Enums<"app_role">;

export interface SessionUser {
  id: string;
  email: string | null;
  fullName: string;
  displayName: string;
  isActive: boolean;
  roles: AppRole[];
  isStaff: boolean;
  isDirector: boolean;
}

/** Usuário da requisição atual (deduplicado por requisição). */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  const id = claims.sub;

  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("full_name, display_name, is_active").eq("id", id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", id),
  ]);
  const roles = (roleRows ?? []).map((r) => r.role);
  const fullName = profile?.full_name || (typeof claims.email === "string" ? claims.email.split("@")[0] : "Integrante");
  return {
    id,
    email: typeof claims.email === "string" ? claims.email : null,
    fullName,
    displayName: profile?.display_name || fullName.split(" ")[0],
    isActive: profile?.is_active ?? false,
    roles,
    isStaff: roles.includes("professor") || roles.includes("diretor"),
    isDirector: roles.includes("diretor"),
  };
});

export async function requireUser(opts: { allowPending?: boolean } = {}): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/entrar");
  if (!user.isActive && !opts.allowPending) redirect("/aguardando");
  return user;
}

export async function requireStaff(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.isStaff) redirect("/inicio?aviso=sem-permissao");
  return user;
}

export async function requireDirector(): Promise<SessionUser> {
  const user = await requireUser();
  if (!user.isDirector) redirect("/inicio?aviso=sem-permissao");
  return user;
}

/** Para Server Actions: lança erro em vez de redirecionar. */
export async function actionUser(role?: "staff" | "diretor"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !user.isActive) throw new Error("Sessão expirada. Entre novamente.");
  if (role === "staff" && !user.isStaff) throw new Error("Sem permissão para esta ação.");
  if (role === "diretor" && !user.isDirector) throw new Error("Apenas o diretor musical pode fazer isso.");
  return user;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  integrante: "Integrante",
  professor: "Professor(a) / preparador(a) vocal",
  diretor: "Diretor(a) musical",
};
