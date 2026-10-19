"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAllRecordings, deleteMyAccount, updateProfile } from "@/app/actions/account";
import { initialActionState } from "@/lib/action-result";

export function ProfileForm({ fullName, displayName }: { fullName: string; displayName: string | null }) {
  const [state, action, pending] = useActionState(updateProfile, initialActionState);
  const router = useRouter();
  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      router.refresh();
    } else if (!state.ok && state.error) toast.error(state.error);
  }, [state, router]);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_200px_auto] sm:items-end">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input id="fullName" name="fullName" defaultValue={fullName} required minLength={3} maxLength={120} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Como prefere ser chamado(a)</Label>
        <Input id="displayName" name="displayName" defaultValue={displayName ?? ""} maxLength={60} />
      </div>
      <Button type="submit" disabled={pending}>
        Salvar
      </Button>
    </form>
  );
}

export function DeleteRecordingsButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir todas as suas gravações salvas?")) return;
        startTransition(async () => {
          const r = await deleteAllRecordings();
          if (r.ok) toast.success(r.message ?? "Feito");
          else toast.error(r.error);
          router.refresh();
        });
      }}
    >
      Excluir todas as gravações
    </Button>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteMyAccount, initialActionState);
  return (
    <form action={action} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="confirm">Digite EXCLUIR para confirmar</Label>
        <Input id="confirm" name="confirm" autoComplete="off" className="max-w-xs" />
      </div>
      {!state.ok && state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" variant="destructive" disabled={pending}>
        Excluir minha conta e todos os meus dados
      </Button>
    </form>
  );
}
