"use client";

import { useEffect, useRef } from "react";
import { startLesson } from "@/app/actions/practice";

/** Marca a aula como iniciada (não como concluída) ao abrir a página. */
export function LessonStarter({ lessonId, path, started }: { lessonId: string; path: string; started: boolean }) {
  const once = useRef(false);
  useEffect(() => {
    if (started || once.current) return;
    once.current = true;
    void startLesson(lessonId, path).catch(() => {});
  }, [lessonId, path, started]);
  return null;
}
