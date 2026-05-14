/**
 * Screen-reader announcement bridge for the Phaser canvas.
 *
 * Phaser renders to a `<canvas>`, which is invisible to assistive tech.
 * `GameMount.tsx` mounts two ARIA-live containers next to the canvas:
 *
 *   #game-aria-live    — role=status, aria-live=polite   (default UI)
 *   #game-aria-alerts  — role=alert,  aria-live=assertive (errors)
 *
 * Call `announce(text)` for routine UI changes (interact prompts, district
 * pills, dialog lines) and `announce(text, "assertive")` for blocking
 * conditions (load errors, fatal state).
 *
 * Idempotency: repeated `announce("Press E to enter")` calls would normally
 * be skipped by AT software because the DOM didn't change. We clear the
 * node briefly then re-set, which forces another announcement.
 */

export type AnnounceSeverity = "polite" | "assertive";

const POLITE_ID = "game-aria-live";
const ASSERTIVE_ID = "game-aria-alerts";
const CLEAR_DELAY_MS = 30;

export function announce(
  text: string,
  severity: AnnounceSeverity = "polite",
): void {
  if (typeof document === "undefined") return;
  const trimmed = text.trim();
  if (trimmed.length === 0) return;

  const id = severity === "assertive" ? ASSERTIVE_ID : POLITE_ID;
  const node = document.getElementById(id);
  if (node === null) return;

  // If identical text is already there, briefly clear so AT re-announces.
  if (node.textContent === trimmed) {
    node.textContent = "";
    window.setTimeout(() => {
      node.textContent = trimmed;
    }, CLEAR_DELAY_MS);
    return;
  }
  node.textContent = trimmed;
}
