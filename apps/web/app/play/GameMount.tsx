"use client";

import { useEffect, useRef } from "react";

const FOCUS_DELAY_MS = 100;

export default function GameMount() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let game: { destroy: (a: boolean) => void } | undefined;
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    void (async () => {
      const Phaser = await import("phaser");
      const { createPhaserConfig } = await import("../../../game/src/createPhaserConfig");
      if (cancelled) return;

      game = new Phaser.Game(createPhaserConfig({ parent: containerRef.current ?? undefined }));

      // Pull keyboard focus onto the canvas container so the game receives
      // input immediately after mount — and so screen-reader users land
      // somewhere useful when they tab into the page.
      focusTimer = setTimeout(() => {
        containerRef.current?.focus();
      }, FOCUS_DELAY_MS);
    })();

    return () => {
      cancelled = true;
      if (focusTimer !== undefined) clearTimeout(focusTimer);
      game?.destroy(true);
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        id="game-root"
        role="application"
        aria-label="Money-verse game canvas"
        className="h-screen w-screen"
      />
      <div
        id="game-aria-live"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <div
        id="game-aria-alerts"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
}
