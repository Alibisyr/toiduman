import { cn } from "@/lib/utils";

/**
 * Subtle Kazakh-style ornamental divider (qoshqar-muiz / ram's-horn motif).
 * Inherits color via `currentColor`; keep it muted so it stays an accent.
 */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center text-accent/70",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 240 24"
        className="h-5 w-full max-w-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="0" y1="12" x2="92" y2="12" opacity="0.4" />
        <line x1="148" y1="12" x2="240" y2="12" opacity="0.4" />
        <path d="M120 4 L129 12 L120 20 L111 12 Z" />
        <circle cx="120" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <path d="M104 12 c -7 -8, -16 -2, -10 7" />
        <path d="M136 12 c 7 -8, 16 -2, 10 7" />
      </svg>
    </div>
  );
}

/**
 * A single corner flourish (top-left orientation). Rotate via `className`
 * (e.g. `rotate-90`) to frame each corner of an invitation card.
 */
export function OrnamentCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-8 w-8 text-accent/45", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 16 V9 a4 4 0 0 1 4-4 H16" />
      <path d="M16 5 c 6 0, 9 5, 6 9 c -1.6 2.4, -5.4 1.6, -4.6 -1.6" />
      <path d="M5 16 c 0 6, 5 9, 9 6 c 2.4 -1.6, 1.6 -5.4, -1.6 -4.6" />
    </svg>
  );
}
