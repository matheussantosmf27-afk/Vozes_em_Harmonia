import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/env";
import type { Database } from "./database.types";

const PUBLIC_PATHS = ["/", "/entrar", "/cadastro", "/recuperar-senha", "/auth", "/privacidade", "/configuracao"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || (p !== "/" && pathname.startsWith(`${p}/`)));
}

/** Renova a sessão do Supabase a cada requisição e protege as rotas internas. */
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    if (isPublic(request.nextUrl.pathname)) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/configuracao";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Não coloque código entre createServerClient e getClaims (recomendação do Supabase).
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId && !isPublic(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("voltar", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (userId && ["/entrar", "/cadastro"].includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/inicio";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}
