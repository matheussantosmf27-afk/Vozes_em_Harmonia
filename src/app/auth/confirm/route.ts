import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/** Confirmação de e-mail, link mágico e recuperação de senha (PKCE ou token_hash). */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawNext = searchParams.get("next") ?? "/inicio";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/inicio";
  const supabase = await createClient();

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }

  const url = request.nextUrl.clone();
  url.search = "";
  if (ok) {
    url.pathname = next;
    return NextResponse.redirect(url);
  }
  url.pathname = "/entrar";
  url.searchParams.set("erro", "link-invalido");
  return NextResponse.redirect(url);
}
