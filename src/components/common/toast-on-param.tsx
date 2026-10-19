"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const MESSAGES: Record<string, [type: "info" | "success" | "error", text: string]> = {
  "sem-permissao": ["error", "Você não tem permissão para acessar aquela página."],
  "senha-alterada": ["success", "Senha alterada com sucesso."],
  "conta-atualizada": ["success", "Dados atualizados."],
};

export function ToastOnParam() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const key = params.get("aviso");
    if (!key || !MESSAGES[key]) return;
    const [type, text] = MESSAGES[key];
    toast[type](text);
    router.replace(pathname);
  }, [params, router, pathname]);
  return null;
}
