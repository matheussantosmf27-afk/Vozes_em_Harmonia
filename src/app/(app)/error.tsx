"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <AlertTriangle className="size-10 text-warning" aria-hidden />
      <h1 className="text-2xl font-semibold">Algo não saiu como esperado</h1>
      <p className="text-muted-foreground">
        Não foi possível carregar esta página. Verifique sua conexão e tente novamente. Se o problema continuar, avise a
        liderança do ministério.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
