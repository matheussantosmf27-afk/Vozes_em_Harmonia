"use client";

import { useEffect, useMemo } from "react";
import { isBlackKey, noteName } from "@/lib/music/notes";
import { playMidi } from "@/lib/audio/engine";
import { cn } from "@/lib/utils";

export type KeyTone = "primary" | "success" | "destructive" | "gold" | "muted";

const TONE_CLASS: Record<KeyTone, { white: string; black: string }> = {
  primary: { white: "bg-primary/25 border-primary", black: "bg-primary" },
  success: { white: "bg-success/30 border-success", black: "bg-success" },
  destructive: { white: "bg-destructive/25 border-destructive", black: "bg-destructive" },
  gold: { white: "bg-gold/40 border-gold", black: "bg-gold" },
  muted: { white: "bg-muted", black: "bg-muted-foreground" },
};

// Teclas do computador → semitons a partir da primeira nota Dó visível
const SHORTCUTS = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", "ç"];

export interface PianoKeyboardProps {
  from: number;
  to: number;
  highlight?: Record<number, KeyTone>;
  labels?: "pt" | "cifra" | "none" | "c-only";
  onPress?: (midi: number) => void;
  playSound?: boolean;
  disabled?: boolean;
  shortcuts?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function PianoKeyboard({
  from,
  to,
  highlight = {},
  labels = "pt",
  onPress,
  playSound = true,
  disabled = false,
  shortcuts = false,
  className,
  ariaLabel = "Teclado musical",
}: PianoKeyboardProps) {
  const keys = useMemo(() => {
    const out: number[] = [];
    for (let m = from; m <= to; m++) out.push(m);
    return out;
  }, [from, to]);
  const whites = keys.filter((m) => !isBlackKey(m));

  const press = (m: number) => {
    if (disabled) return;
    if (playSound) void playMidi(m, { duration: 0.9 });
    onPress?.(m);
  };

  useEffect(() => {
    if (!shortcuts || disabled) return;
    const firstC = keys.find((m) => m % 12 === 0) ?? from;
    const handler = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      const idx = SHORTCUTS.indexOf(e.key.toLowerCase());
      if (idx === -1) return;
      const m = firstC + idx;
      if (m < from || m > to) return;
      e.preventDefault();
      press(m);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortcuts, disabled, from, to, onPress, playSound]);

  const whiteWidth = 100 / whites.length;
  const label = (m: number) => {
    if (labels === "none") return null;
    if (labels === "c-only") return m % 12 === 0 ? noteName(m) : null;
    return noteName(m, { style: labels === "cifra" ? "cifra" : "pt", withOctave: m % 12 === 0 });
  };

  return (
    <div className={cn("relative h-36 w-full select-none touch-manipulation sm:h-44", className)} role="group" aria-label={ariaLabel}>
      <div className="flex h-full">
        {whites.map((m) => {
          const tone = highlight[m];
          return (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onPointerDown={(e) => {
                e.preventDefault();
                press(m);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  press(m);
                }
              }}
              aria-label={noteName(m)}
              className={cn(
                "relative flex flex-1 items-end justify-center rounded-b-md border border-border bg-card pb-2 text-[10px] font-medium text-muted-foreground shadow-[inset_0_-4px_0_rgba(0,0,0,0.05)] transition-colors active:bg-secondary disabled:cursor-not-allowed sm:text-xs",
                tone && TONE_CLASS[tone].white,
              )}
              style={{ width: `${whiteWidth}%` }}
            >
              {label(m)}
            </button>
          );
        })}
      </div>
      {keys
        .filter((m) => isBlackKey(m))
        .map((m) => {
          const leftWhiteIndex = whites.filter((w) => w < m).length;
          const tone = highlight[m];
          return (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onPointerDown={(e) => {
                e.preventDefault();
                press(m);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  press(m);
                }
              }}
              aria-label={noteName(m)}
              className={cn(
                "absolute top-0 z-10 h-[60%] rounded-b-md bg-foreground shadow-md transition-colors active:bg-primary disabled:cursor-not-allowed",
                tone && TONE_CLASS[tone].black,
              )}
              style={{ left: `calc(${leftWhiteIndex * whiteWidth}% - ${whiteWidth * 0.3}%)`, width: `${whiteWidth * 0.6}%` }}
            />
          );
        })}
    </div>
  );
}
