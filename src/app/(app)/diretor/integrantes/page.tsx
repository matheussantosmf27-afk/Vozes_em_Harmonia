import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { ApproveButtons, RoleToggle } from "@/components/director/director-controls";
import { requireDirector } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Integrantes e papéis" };

export default async function IntegrantesPage() {
  const me = await requireDirector();
  const supabase = await createClient();
  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, is_active, created_at").order("is_active").order("full_name"),
    supabase.from("user_roles").select("user_id, role"),
  ]);
  const rolesBy = new Map<string, string[]>();
  for (const r of roles ?? []) rolesBy.set(r.user_id, [...(rolesBy.get(r.user_id) ?? []), r.role]);
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/diretor" className="hover:underline">
          Direção musical
        </Link>{" "}
        / Integrantes
      </nav>
      <PageHeader
        title="Integrantes e papéis"
        description="Aprove novos cadastros, suspenda acessos e defina quem é professor(a) ou diretor(a). Uma pessoa pode ter mais de um papel. Novos integrantes se cadastram pela página “Criar conta”."
      />
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Cadastro</th>
              <th className="p-3">Papéis</th>
              <th className="p-3">Acesso</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(profiles ?? []).map((p) => {
              const r = rolesBy.get(p.id) ?? [];
              return (
                <tr key={p.id}>
                  <td className="p-3">
                    <Link href={`/professor/integrantes/${p.id}`} className="font-medium text-primary hover:underline">
                      {p.full_name}
                    </Link>
                    {p.id === me.id && <span className="text-xs text-muted-foreground"> (você)</span>}
                  </td>
                  <td className="p-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-4">
                      <RoleToggle userId={p.id} role="professor" on={r.includes("professor")} label="Professor(a)" />
                      <RoleToggle userId={p.id} role="diretor" on={r.includes("diretor")} label="Diretor(a)" />
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {p.is_active ? <Badge variant="secondary">Ativo</Badge> : <Badge variant="destructive">Pendente/suspenso</Badge>}
                      {p.id !== me.id && <ApproveButtons userId={p.id} active={p.is_active} />}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
