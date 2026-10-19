"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordReset, signIn, signUp, updatePassword } from "@/app/actions/auth";
import { initialActionState } from "@/lib/action-result";

function Feedback({ state }: { state: typeof initialActionState }) {
  if (!state.ok && state.error) {
    return (
      <Alert variant="destructive" role="alert">
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }
  if (state.ok && state.message) {
    return (
      <Alert role="status">
        <CheckCircle2 className="text-success" />
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }
  return null;
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}

export function SignInForm({ voltar }: { voltar?: string }) {
  const [state, action, pending] = useActionState(signIn, initialActionState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="voltar" value={voltar ?? "/inicio"} />
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link href="/recuperar-senha" className="text-sm text-primary underline-offset-4 hover:underline">
            Esqueci a senha
          </Link>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Feedback state={state} />
      <Submit pending={pending}>Entrar</Submit>
    </form>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, initialActionState);
  if (state.ok) return <Feedback state={state} />;
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input id="fullName" name="fullName" autoComplete="name" required minLength={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} aria-describedby="senha-ajuda" />
        <p id="senha-ajuda" className="text-xs text-muted-foreground">Pelo menos 8 caracteres, com letras e números.</p>
      </div>
      <label className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-[var(--primary)]" />
        <span>
          Li e concordo com a{" "}
          <Link href="/privacidade" target="_blank" className="text-primary underline underline-offset-4">
            política de privacidade
          </Link>
          . Entendo que meus dados de estudo serão vistos pelos professores e pelo diretor musical do ministério.
        </span>
      </label>
      <Feedback state={state} />
      <Submit pending={pending}>Criar conta</Submit>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialActionState);
  if (state.ok) return <Feedback state={state} />;
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail da sua conta</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <Feedback state={state} />
      <Submit pending={pending}>Enviar link</Submit>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialActionState);
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirme a nova senha</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
      </div>
      <Feedback state={state} />
      <Submit pending={pending}>Salvar nova senha</Submit>
    </form>
  );
}
