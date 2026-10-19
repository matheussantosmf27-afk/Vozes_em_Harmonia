"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAudioSupported, playEvents, type PlaybackHandle } from "@/lib/audio/engine";
import type { Instrument, NoteEvent } from "@/lib/exercises/generators";
import { cn } from "@/lib/utils";

export function PlayButton({
  events,
  label = "Ouvir",
  speed = 1,
  instrument,
  variant = "secondary",
  size = "default",
  className,
  onPlayed,
}: {
  events: NoteEvent[];
  label?: string;
  speed?: number;
  instrument?: Instrument;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  onPlayed?: () => void;
}) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const handle = useRef<PlaybackHandle | null>(null);
  const supported = typeof window === "undefined" || isAudioSupported();

  useEffect(() => () => handle.current?.stop(), []);

  async function toggle() {
    if (state === "playing") {
      handle.current?.stop();
      setState("idle");
      return;
    }
    setState("loading");
    try {
      const h = await playEvents(events, { speed, instrument });
      handle.current = h;
      setState("playing");
      onPlayed?.();
      await h.done;
    } finally {
      setState("idle");
    }
  }

  return (
    <Button type="button" variant={variant} size={size} onClick={toggle} disabled={!supported || events.length === 0} className={cn(className)} aria-live="polite">
      {state === "loading" ? <Loader2 className="animate-spin" /> : state === "playing" ? <Square /> : <Play />}
      {state === "playing" ? "Parar" : label}
    </Button>
  );
}
