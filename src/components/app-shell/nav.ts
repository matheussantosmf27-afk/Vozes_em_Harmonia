import {
  CalendarDays,
  ClipboardList,
  Compass,
  Ear,
  GitMerge,
  GraduationCap,
  House,
  LayoutDashboard,
  Library,
  MicVocal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  audience: "todos" | "staff" | "diretor";
  primaryMobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/inicio", label: "Início", short: "Início", icon: House, audience: "todos", primaryMobile: true },
  { href: "/jornada", label: "Minha jornada", short: "Jornada", icon: Compass, audience: "todos", primaryMobile: true },
  { href: "/aprender", label: "Aprender", short: "Aprender", icon: GraduationCap, audience: "todos", primaryMobile: true },
  { href: "/ouvido", label: "Treinar ouvido", short: "Ouvido", icon: Ear, audience: "todos" },
  { href: "/voz", label: "Treinar minha voz", short: "Voz", icon: MicVocal, audience: "todos", primaryMobile: true },
  { href: "/harmonia", label: "Cantar em harmonia", short: "Harmonia", icon: GitMerge, audience: "todos" },
  { href: "/repertorio", label: "Partituras e repertório", short: "Repertório", icon: Library, audience: "todos" },
  { href: "/ensaios", label: "Ensaios", short: "Ensaios", icon: CalendarDays, audience: "todos" },
  { href: "/progresso", label: "Meu progresso", short: "Progresso", icon: TrendingUp, audience: "todos" },
  { href: "/professor", label: "Área do professor", short: "Professor", icon: ClipboardList, audience: "staff" },
  { href: "/diretor", label: "Direção musical", short: "Direção", icon: LayoutDashboard, audience: "diretor" },
];

export function navFor(user: { isStaff: boolean; isDirector: boolean }): NavItem[] {
  return NAV_ITEMS.filter((i) => i.audience === "todos" || (i.audience === "staff" && user.isStaff) || (i.audience === "diretor" && user.isDirector));
}
