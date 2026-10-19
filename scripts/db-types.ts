/** Converte a introspecção (scripts/db-introspect.sql) no tipo Database do supabase-js. */
import { readFileSync } from "node:fs";

interface Col { table: string; name: string; udt: string; type: string; nullable: boolean; hasDefault: boolean; generated: boolean }
interface Fk { name: string; table: string; columns: string[]; refTable: string; refColumns: string[]; oneToOne: boolean }
interface Fn { name: string; args: { name: string; type: string }[]; returns: string; retset: boolean; outCols: { name: string; type: string }[] | null }

const schema = JSON.parse(readFileSync(process.argv[2], "utf8")) as { columns: Col[]; enums: Record<string, string[]>; fks: Fk[]; functions: Fn[] };
const enums = schema.enums ?? {};

function tsType(udtOrType: string): string {
  const t = udtOrType.replace(/^public\./, "");
  if (t.startsWith("_")) return `${tsType(t.slice(1))}[]`;
  if (t.endsWith("[]")) return `${tsType(t.slice(0, -2))}[]`;
  if (enums[t]) return `Database["public"]["Enums"]["${t}"]`;
  switch (t) {
    case "int2": case "int4": case "int8": case "float4": case "float8": case "numeric":
    case "smallint": case "integer": case "bigint": case "real": case "double precision":
      return "number";
    case "bool": case "boolean": return "boolean";
    case "json": case "jsonb": return "Json";
    case "void": return "undefined";
    default: return "string";
  }
}

const tables = [...new Set(schema.columns.map((c) => c.table))].sort();
const o: string[] = [];
o.push("// GERADO por scripts/generate-db-types.sh a partir das migrations — não edite à mão.");
o.push("export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];");
o.push("");
o.push("export type Database = {");
o.push("  public: {");
o.push("    Tables: {");
for (const t of tables) {
  const cols = schema.columns.filter((c) => c.table === t);
  o.push(`      ${t}: {`);
  o.push("        Row: {");
  for (const c of cols) o.push(`          ${c.name}: ${tsType(c.udt)}${c.nullable ? " | null" : ""};`);
  o.push("        };");
  o.push("        Insert: {");
  for (const c of cols) {
    if (c.generated) { o.push(`          ${c.name}?: never;`); continue; }
    o.push(`          ${c.name}${c.nullable || c.hasDefault ? "?" : ""}: ${tsType(c.udt)}${c.nullable ? " | null" : ""};`);
  }
  o.push("        };");
  o.push("        Update: {");
  for (const c of cols) {
    if (c.generated) { o.push(`          ${c.name}?: never;`); continue; }
    o.push(`          ${c.name}?: ${tsType(c.udt)}${c.nullable ? " | null" : ""};`);
  }
  o.push("        };");
  const fks = (schema.fks ?? []).filter((f) => f.table === t);
  o.push("        Relationships: [");
  for (const f of fks) {
    o.push(`          { foreignKeyName: "${f.name}"; columns: [${f.columns.map((c) => `"${c}"`).join(", ")}]; isOneToOne: ${f.oneToOne}; referencedRelation: "${f.refTable}"; referencedColumns: [${f.refColumns.map((c) => `"${c}"`).join(", ")}] },`);
  }
  o.push("        ];");
  o.push("      };");
}
o.push("    };");
o.push("    Views: { [_ in never]: never };");
o.push("    Functions: {");
const fnNames = [...new Set(schema.functions.map((f) => f.name))].sort();
for (const name of fnNames) {
  const f = schema.functions.find((x) => x.name === name)!;
  const args = f.args.length ? `{ ${f.args.map((a) => `${a.name}: ${tsType(a.type)}`).join("; ")} }` : "Record<PropertyKey, never>";
  let ret: string;
  if (f.outCols && f.outCols.length) ret = `{ ${f.outCols.map((c) => `${c.name}: ${tsType(c.type)}`).join("; ")} }[]`;
  else ret = `${tsType(f.returns)}${f.retset ? "[]" : ""}`;
  o.push(`      ${name}: { Args: ${args}; Returns: ${ret} };`);
}
o.push("    };");
o.push("    Enums: {");
for (const [k, v] of Object.entries(enums).sort()) o.push(`      ${k}: ${v.map((x) => `"${x}"`).join(" | ")};`);
o.push("    };");
o.push("    CompositeTypes: { [_ in never]: never };");
o.push("  };");
o.push("};");
o.push("");
o.push('type PublicSchema = Database["public"];');
o.push('export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];');
o.push('export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"];');
o.push('export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"];');
o.push('export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];');
process.stdout.write(o.join("\n") + "\n");
