"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ASSIST_EVENT,
  ASSIST_STORAGE_KEY,
  type AssistChangeDetail,
} from "../../../game/src/lib/assist";

/**
 * Assist Mode toggle (PRD pillar #10).
 *
 * Lives outside the Phaser canvas so it's reachable by keyboard, screen
 * reader, and pointer regardless of focus state inside the game. The actual
 * effects of "on" are read by the game layer via `apps/game/src/lib/assist.ts`.
 *
 * State sync: `money-verse:assist-mode-changed` window event + localStorage.
 */
export default function AssistModeButton() {
  const [enabled, setEnabled] = useState(false);

  // Hydrate once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(ASSIST_STORAGE_KEY);
      if (raw === "true") setEnabled(true);
    } catch {
      // localStorage unavailable; default off.
    }

    const onExternal = (event: Event): void => {
      const detail = (event as CustomEvent<AssistChangeDetail>).detail;
      if (detail === undefined) return;
      setEnabled(detail.enabled);
    };
    window.addEventListener(ASSIST_EVENT, onExternal);
    return () => window.removeEventListener(ASSIST_EVENT, onExternal);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(
          ASSIST_STORAGE_KEY,
          next ? "true" : "false",
        );
      } catch {
        // best effort
      }
      const detail: AssistChangeDetail = { enabled: next };
      window.dispatchEvent(new CustomEvent(ASSIST_EVENT, { detail }));
      announceToLiveRegion(`Assist Mode ${next ? "on" : "off"}`);
      return next;
    });
  }, []);

  const label = `Assist Mode: ${enabled ? "On" : "Off"}`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={label}
      className="
        fixed top-3 left-3 z-50
        h-8 px-3 rounded-full
        text-xs font-mono
        bg-[var(--color-indigo-night)]/85
        text-[var(--color-saffron)]
        border border-[var(--color-saffron)]
        hover:bg-[var(--color-saffron)]
        hover:text-[var(--color-indigo-night)]
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-[var(--color-saffron)]
        focus-visible:outline-offset-2
        transition-colors
      "
    >
      {label}
    </button>
  );
}

function announceToLiveRegion(message: string): void {
  if (typeof document === "undefined") return;
  const node = document.getElementById("game-aria-live");
  if (node === null) return;
  node.textContent = "";
  // Force re-announce after a tick so AT picks it up even on rapid toggles.
  window.setTimeout(() => {
    node.textContent = message;
  }, 30);
}
