"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/brand/logo";
import { SidebarNav } from "./nav-links";

export function MobileMenu({ access }: { access: { isStaff: boolean; isDirector: boolean } }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Abrir menu" />}>
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-[290px] overflow-y-auto bg-sidebar p-4">
        <SheetHeader className="p-0 pb-4">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <SidebarNav access={access} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
