"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navFor, NAV_ITEMS } from "./nav";

type Access = { isStaff: boolean; isDirector: boolean };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ access, onNavigate }: { access: Access; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = navFor(access);
  const main = items.filter((i) => i.audience === "todos");
  const admin = items.filter((i) => i.audience !== "todos");
  const link = (i: (typeof NAV_ITEMS)[number]) => {
    const active = isActive(pathname, i.href);
    return (
      <li key={i.href}>
        <Link
          href={i.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
          )}
        >
          <i.icon className={cn("size-[18px]", active && "text-primary")} aria-hidden />
          {i.label}
        </Link>
      </li>
    );
  };
  return (
    <nav aria-label="Navegação principal" className="space-y-6">
      <ul className="space-y-0.5">{main.map(link)}</ul>
      {admin.length > 0 && (
        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Acompanhamento</p>
          <ul className="space-y-0.5">{admin.map(link)}</ul>
        </div>
      )}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((i) => i.primaryMobile);
  return (
    <nav aria-label="Atalhos" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-4">
        {items.map((i) => {
          const active = isActive(pathname, i.href);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={cn("flex flex-col items-center gap-1 py-2 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}
              >
                <i.icon className="size-5" aria-hidden />
                {i.short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
