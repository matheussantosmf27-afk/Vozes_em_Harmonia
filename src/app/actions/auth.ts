"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";
import { translateAuthError, type ActionResult } from "@/lib/action-result";

async function origin() {
  const h = await headers();
  return h.get("origin") ?? siteUrl();
}

function safeNext(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/inicio";
}

const signInSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe a senha."),
});

export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: translateAuthError(error) };
  redirect(safeNext(formData.get("voltar")));
}

const signUpSchema = z.object({
  fullName: z.string().trim().min(3, "Informe seu nome completo.").max(120),
  email: z.email("Informe um e-mail válido."),
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres.")
    .regex(/[A-Za-z]/, "Use letras e números na senha.")
    .regex(/\d/, "Use letras e números na senha."),
  consent: z.literal("on", { error: "É preciso concordar com a política de privacidade para criar a conta." }),
});

export async function signUp(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName, privacy_consent_at: new Date().toISOString() },
      emailRedirectTo: `${await origin()}/auth/confirm?next=/inicio`,
    },
  });
  if (error) return { ok: false, error: translateAuthError(error) };
  if (data.session) redirect("/inicio");
  return {
    ok: true,
    message: "Conta criada! Enviamos um link de confirmação para o seu e-mail. Depois de confirmar, o diretor musical aprova o seu acesso.",
  };
}

export async function requestPasswordReset(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = z.email().safeParse(formData.get("email"));
  if (!email.success) return { ok: false, error: "Informe um e-mail válido." };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${await origin()}/auth/confirm?next=/auth/nova-senha`,
  });
  if (error && error.code !== "user_not_found") return { ok: false, error: translateAuthError(error) };
  // Mesma resposta para e-mails existentes ou não (evita enumeração de contas).
  return { ok: true, message: "Se houver uma conta com este e-mail, você receberá um link para criar uma nova senha." };
}

export async function updatePassword(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const password = signUpSchema.shape.password.safeParse(formData.get("password"));
  if (!password.success) return { ok: false, error: password.error.issues[0].message };
  if (formData.get("password") !== formData.get("confirm")) return { ok: false, error: "As senhas não conferem." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) return { ok: false, error: translateAuthError(error) };
  redirect("/inicio?aviso=senha-alterada");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
