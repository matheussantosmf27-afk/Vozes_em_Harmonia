"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { addGroupMember, createGroup, removeGroupMember, setGroupMemberPart, setMemberActive, setRole } from "@/app/actions/director";
import { initialActionState } from "@/lib/action-result";

export function ApproveButtons({ userId, active }: { userId: string; active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant={active ? "ghost" : "default"}
      disabled={pending}
      onClick={() => {
        if (active && !confirm("Suspender o acesso desta pessoa? Os dados são mantidos.")) return;
        startTransition(async () => {
          const r = await setMemberActive(userId, !active);
          if (r.ok) toast.success(r.message ?? "Feito");
          else toast.error(r.error);
          router.refresh();
        });
      }}
    >
      {active ? "Suspender acesso" : "Aprovar acesso"}
    </Button>
  );
}

export function RoleToggle({ userId, role, on, label }: { userId: string; role: "professor" | "diretor"; on: boolean; label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="size-4"
        defaultChecked={on}
        disabled={pending}
        onChange={(e) =>
          startTransition(async () => {
            const r = await setRole(userId, role, e.target.checked);
            if (!r.ok) {
              toast.error(r.error);
              e.target.checked = !e.target.checked;
            } else toast.success("Papel atualizado.");
            router.refresh();
          })
        }
      />
      {label}
    </label>
  );
}

export function GroupCreateForm() {
  const [state, action, pending] = useActionState(createGroup, initialActionState);
  useEffect(() => {
    if (!state.ok && state.error) toast.error(state.error);
  }, [state]);
  return (
    <form action={action} className="grid gap-2 sm:grid-cols-[1fr_200px_auto] sm:items-end">
      <div className="space-y-1.5">
        <Label htmlFor="g-name">Nome</Label>
        <Input id="g-name" name="name" required maxLength={120} placeholder="Ex.: Quarteto masculino, Coral jovem, Turma iniciante" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="g-kind">Tipo</Label>
        <NativeSelect id="g-kind" name="kind" defaultValue="coral" options={[{ value: "coral", label: "Coral" }, { value: "quarteto", label: "Quarteto" }, { value: "pequeno_grupo", label: "Pequeno grupo" }, { value: "equipe_louvor", label: "Equipe de louvor" }, { value: "turma", label: "Turma de estudo" }]} />
      </div>
      <Button type="submit" disabled={pending}>
        Criar grupo
      </Button>
    </form>
  );
}

export function AddMemberForm({ groupId, candidates, parts }: { groupId: string; candidates: { id: string; label: string }[]; parts: string[] }) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [part, setPart] = useState(parts[0] ?? "");
  const [pending, startTransition] = useTransition();
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_200px_auto]">
      <NativeSelect aria-label="Integrante" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Adicionar integrante…" options={candidates.map((c) => ({ value: c.id, label: c.label }))} />
      <Input aria-label="Voz no grupo" list="partes" value={part} onChange={(e) => setPart(e.target.value)} placeholder="Voz (ex.: Tenor 1)" />
      <datalist id="partes">
        {parts.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <Button
        disabled={!userId || pending}
        onClick={() =>
          startTransition(async () => {
            const r = await addGroupMember(groupId, userId, part);
            if (!r.ok) toast.error(r.error);
            setUserId("");
            router.refresh();
          })
        }
      >
        Adicionar
      </Button>
    </div>
  );
}

export function MemberPartSelect({ groupId, userId, value, parts }: { groupId: string; userId: string; value: string; parts: string[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-1">
      <NativeSelect
        aria-label="Voz no grupo"
        defaultValue={value}
        disabled={pending}
        onChange={(e) =>
          startTransition(async () => {
            await setGroupMemberPart(groupId, userId, e.target.value);
            router.refresh();
          })
        }
        placeholder="Sem voz definida"
        options={[...new Set([...parts, value].filter(Boolean))].map((p) => ({ value: p, label: p }))}
        className="w-44"
      />
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await removeGroupMember(groupId, userId);
            router.refresh();
          })
        }
      >
        Remover
      </Button>
    </div>
  );
}
