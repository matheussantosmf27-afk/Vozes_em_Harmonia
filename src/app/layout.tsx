import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Music } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin", "latin-ext"], display: "swap", axes: ["opsz"] });
const notoMusic = Noto_Music({ variable: "--font-noto-music", subsets: ["music"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Vozes em Harmonia", template: "%s · Vozes em Harmonia" },
  description:
    "Escola digital de formação vocal, percepção musical e harmonia para o ministério de música da igreja.",
  applicationName: "Vozes em Harmonia",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#141a2e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable} ${notoMusic.variable} h-full`}>
      <body className="min-h-full">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          Pular para o conteúdo
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
