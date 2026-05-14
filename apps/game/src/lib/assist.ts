/**
 * Assist Mode store (PRD pillar #10).
 *
 * Single source of truth for the assist-mode flag. The toggle lives in a
 * React component (`apps/web/app/play/AssistModeButton.tsx`) but Phaser
 * scenes read & subscribe through this module so the game layer stays
 * framework-agnostic.
 *
 * Persistence: localStorage key `money-verse.assistMode`.
 * Cross-context sync: window `money-verse:assist-mode-changed` CustomEvent.
 */

export const ASSIST_STORAGE_KEY = "money-verse.assistMode";
export const ASSIST_EVENT = "money-verse:assist-mode-changed";

export interface AssistChangeDetail {
  readonly enabled: boolean;
}

type Listener = (enabled: boolean) => void;

let cachedValue: boolean | undefined;
const listeners = new Set<Listener>();
let windowBound = false;

function readFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(ASSIST_STORAGE_KEY);
    return raw === "true";
  } catch {
    return false;
  }
}

function writeToStorage(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ASSIST_STORAGE_KEY, enabled ? "true" : "false");
  } catch {
    // localStorage may be unavailable (private mode, quotas). Best effort only.
  }
}

function bindWindowListenerOnce(): void {
  if (windowBound) return;
  if (typeof window === "undefined") return;
  windowBound = true;
  window.addEventListener(ASSIST_EVENT, (event: Event) => {
    const detail = (event as CustomEvent<AssistChangeDetail>).detail;
    if (detail === undefined) return;
    cachedValue = detail.enabled;
    writeToStorage(detail.enabled);
    for (const listener of listeners) listener(detail.enabled);
  });
}

export function getAssistMode(): boolean {
  if (cachedValue === undefined) {
    cachedValue = readFromStorage();
  }
  return cachedValue;
}

export function setAssistMode(enabled: boolean): void {
  cachedValue = enabled;
  writeToStorage(enabled);
  if (typeof window === "undefined") return;
  const event = new CustomEvent<AssistChangeDetail>(ASSIST_EVENT, {
    detail: { enabled },
  });
  window.dispatchEvent(event);
}

export function subscribeAssistMode(listener: Listener): () => void {
  bindWindowListenerOnce();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
