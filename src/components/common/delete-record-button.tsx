"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAttempt, deletePracticeLog } from "@/app/actions/practice";

export function DeleteRecordButton({ id, kind }: { id: string; kind: "attempt" | "log" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label="Excluir registro"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir este registro? O domínio da habilidade será recalculado.")) return;
        startTransition(async () => {
          const r = kind === "attempt" ? await deleteAttempt(id) : await deletePracticeLog(id);
          if (r.ok) {
            toast.success("Registro excluído.");
            router.refresh();
          } else toast.error(r.error);
        });
      }}
    >
      <Trash2 />
    </Button>
  );
}
