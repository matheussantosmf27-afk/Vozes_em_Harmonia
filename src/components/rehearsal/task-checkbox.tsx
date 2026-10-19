"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleTask } from "@/app/actions/rehearsals";

export function TaskCheckbox({ id, done, canToggle }: { id: string; done: boolean; canToggle: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <input
      type="checkbox"
      aria-label={done ? "Marcar como pendente" : "Marcar como feita"}
      className="mt-0.5 size-5 accent-[var(--primary)]"
      defaultChecked={done}
      disabled={!canToggle || pending}
      onChange={(e) =>
        startTransition(async () => {
          const r = await toggleTask(id, e.target.checked);
          if (!r.ok) toast.error(r.error);
          router.refresh();
        })
      }
    />
  );
}
