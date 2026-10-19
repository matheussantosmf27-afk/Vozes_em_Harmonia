"use client";

/**
 * Captação do microfone (somente após autorização) e estimativa contínua da
 * frequência fundamental. Todo o processamento acontece no navegador; nenhum
 * áudio é enviado ou armazenado.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { detectPitch, PitchTracker, type PitchFrame, type TrackedPitch } from "@/lib/music/pitch-detection";
import { unlockAudio } from "./engine";

export type MicStatus = "idle" | "requesting" | "listening" | "denied" | "unsupported" | "error";

export function isMicSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

export function usePitchDetector() {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [pitch, setPitch] = useState<TrackedPitch | null>(null);
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const trackerRef = useRef(new PitchTracker());
  const recordingRef = useRef<{ start: number; frames: PitchFrame[] } | null>(null);
  const bufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const lastRef = useRef(0);

  const frame = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const now = performance.now();
    if (now - lastRef.current >= 40) {
      lastRef.current = now;
      if (!bufRef.current || bufRef.current.length !== analyser.fftSize) bufRef.current = new Float32Array(analyser.fftSize);
      const buf = bufRef.current;
      analyser.getFloatTimeDomainData(buf);
      const est = detectPitch(buf, analyser.context.sampleRate, { minFrequency: 70, maxFrequency: 1100, rmsThreshold: 0.012 });
      const tracked = trackerRef.current.push(est);
      setPitch(tracked);
      setLevel(Math.min(1, est.rms * 6));
      const rec = recordingRef.current;
      if (rec) rec.frames.push({ time: now - rec.start, midi: tracked.midi, confidence: tracked.confidence });
    }
  }, []);

  const startLoop = useCallback(() => {
    const tick = () => {
      if (!analyserRef.current) return;
      frame();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [frame]);

  const start = useCallback(async () => {
    if (!isMicSupported()) {
      setStatus("unsupported");
      return false;
    }
    if (streamRef.current) {
      setStatus("listening");
      return true;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 },
      });
      const c = await unlockAudio();
      const source = c.createMediaStreamSource(stream);
      const highpass = c.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 60;
      const lowpass = c.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 1500;
      const analyser = c.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(highpass).connect(lowpass).connect(analyser);
      streamRef.current = stream;
      sourceRef.current = source;
      analyserRef.current = analyser;
      trackerRef.current.reset();
      setStatus("listening");
      startLoop();
      return true;
    } catch (err) {
      const name = (err as DOMException)?.name;
      setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      return false;
    }
  }, [startLoop]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    sourceRef.current = null;
    analyserRef.current = null;
    recordingRef.current = null;
    setPitch(null);
    setLevel(0);
    setStatus("idle");
  }, []);

  /** Começa a guardar os quadros de altura (para analisar uma nota sustentada). */
  const beginCapture = useCallback(() => {
    trackerRef.current.reset();
    recordingRef.current = { start: performance.now(), frames: [] };
  }, []);

  const endCapture = useCallback((): PitchFrame[] => {
    const frames = recordingRef.current?.frames ?? [];
    recordingRef.current = null;
    return frames;
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { status, pitch, level, start, stop, beginCapture, endCapture };
}
