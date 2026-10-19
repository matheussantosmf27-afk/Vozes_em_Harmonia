import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SidebarNav, BottomNav } from "@/components/app-shell/nav-links";
import { MobileMenu } from "@/components/app-shell/mobile-menu";
import { UserMenu } from "@/components/app-shell/user-menu";
import { requireUser, ROLE_LABELS } from "@/lib/auth";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const access = { isStaff: user.isStaff, isDirector: user.isDirector };
  const roles = user.roles.map((r) => ROLE_LABELS[r].split(" /")[0]);
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto border-r bg-sidebar px-4 py-5 lg:flex">
        <Link href="/inicio" className="px-1">
          <Logo />
        </Link>
        <SidebarNav access={access} />
        <p className="mt-auto px-3 text-xs text-muted-foreground">
          Não é uma ferramenta médica. Em caso de dor ou rouquidão, interrompa e procure um profissional.
        </p>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/90 px-3 backdrop-blur sm:px-6">
          <div className="lg:hidden">
            <MobileMenu access={access} />
          </div>
          <Link href="/inicio" className="lg:hidden">
            <Logo compact />
          </Link>
          <div className="ml-auto">
            <UserMenu name={user.fullName} email={user.email} roles={roles} />
          </div>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
