"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logPractice } from "@/app/actions/practice";
import { initialActionState } from "@/lib/action-result";

export function PracticeLogForm() {
  const [state, action, pending] = useActionState(logPractice, initialActionState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      ref.current?.reset();
    } else if (!state.ok && state.error) toast.error(state.error);
  }, [state]);
  return (
    <form ref={ref} action={action} className="space-y-3">
      <div className="grid grid-cols-[1fr_96px] gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="activity">O que você estudou?</Label>
          <Input id="activity" name="activity" required maxLength={120} placeholder="Ex.: segunda voz do hino 15" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="minutes">Minutos</Label>
          <Input id="minutes" name="minutes" type="number" min={1} max={600} required defaultValue={15} />
        </div>
      </div>
      <Button type="submit" variant="secondary" disabled={pending} className="w-full">
        Registrar estudo
      </Button>
    </form>
  );
}
