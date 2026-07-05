import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Stylized "T" monogram fused with a қошқар мүйіз (ram-horn) scroll, drawn as
 * thin metallic-gold line-art. Square viewBox so it sizes cleanly via h-/w- utilities.
 * IDs are scoped with useId() so multiple instances on one page don't collide.
 */
export function LogoMark({ className }: { className?: string }) {
  const uid = useId();
  const icon = `tdm-icon-${uid}`;
  const soft = `tdm-soft-${uid}`;

  // Right half of the crossbar + ram-horn spiral; the left half is its mirror.
  const horn =
    "M250,63 H278 C293,63 305,59 309,48 C313,36 305,25 293.5,27.5 " +
    "C283,30 279.5,40 288,45 C293.5,48 297,42.5 293.5,39";

  return (
    <svg
      viewBox="175 15 150 150"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Toiduman"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={icon}
          gradientUnits="userSpaceOnUse"
          x1="180"
          y1="20"
          x2="320"
          y2="165"
        >
          <stop offset="0%" stopColor="#F6E7A6" />
          <stop offset="25%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="75%" stopColor="#E0BD4A" />
          <stop offset="100%" stopColor="#9C7B1E" />
        </linearGradient>
        <filter id={soft} x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="2"
            floodColor="#7A5E12"
            floodOpacity="0.4"
          />
        </filter>
      </defs>

      <g
        filter={`url(#${soft})`}
        fill="none"
        stroke={`url(#${icon})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={horn} />
        <path d={horn} transform="translate(500,0) scale(-1,1)" />
        <path d="M250,60 V138" strokeWidth="7.5" />
      </g>

      {/* Ornamental diamond foot (ромб) */}
      <path
        d="M250,140 L259.5,150 L250,160 L240.5,150 Z"
        fill={`url(#${icon})`}
        filter={`url(#${soft})`}
      />
    </svg>
  );
}

/**
 * Full horizontal lockup: monogram mark + "Toiduman" wordmark in the site's
 * display font (kept in CSS rather than baked into the SVG so it matches the
 * rest of the UI).
 */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight",
          wordmarkClassName,
        )}
      >
        Toiduman
      </span>
    </span>
  );
}
