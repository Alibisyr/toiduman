import { cn } from "@/lib/utils";

/**
 * Circular Kazakh ою medallion — a deep-emerald disc with a gold ram's-horn
 * (qoshqar-muiz) cross and a ring of gold dots. Our premium answer to the
 * burgundy seal competitors use, in the Toiduman palette.
 */
export function OrnamentMedallion({ className }: { className?: string }) {
  // Eight gold dots evenly placed on a ring (r = 43 around centre 50,50).
  const dots = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return { x: 50 + 43 * Math.cos(a), y: 50 + 43 * Math.sin(a) };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-20 w-20", className)}
      role="img"
      aria-hidden
    >
      <circle cx="50" cy="50" r="48" fill="var(--primary)" />
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="var(--gold-2)"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="var(--gold-2)"
        strokeWidth="0.8"
        opacity="0.55"
      />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.6" fill="var(--gold-1)" />
      ))}
      <g
        fill="none"
        stroke="var(--gold-1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M50 30 L70 50 L50 70 L30 50 Z" />
        {/* top */}
        <path d="M50 30 C50 20 60 17 63 25 C64.5 30 59 32 57 26" />
        <path d="M50 30 C50 20 40 17 37 25 C35.5 30 41 32 43 26" />
        {/* right */}
        <path d="M70 50 C80 50 83 40 75 37 C70 35.5 68 41 74 43" />
        <path d="M70 50 C80 50 83 60 75 63 C70 64.5 68 59 74 57" />
        {/* bottom */}
        <path d="M50 70 C50 80 60 83 63 75 C64.5 70 59 68 57 74" />
        <path d="M50 70 C50 80 40 83 37 75 C35.5 70 41 68 43 74" />
        {/* left */}
        <path d="M30 50 C20 50 17 40 25 37 C30 35.5 32 41 26 43" />
        <path d="M30 50 C20 50 17 60 25 63 C30 64.5 32 59 26 57" />
      </g>
      <circle cx="50" cy="50" r="3" fill="var(--gold-1)" />
    </svg>
  );
}

/**
 * Themed circular seal — like {@link OrnamentMedallion} but reads the scoped
 * template variables (`--tpr` disc, `--g1`/`--g2` linework) so it recolours per
 * template.
 */
export function TemplateSeal({ className }: { className?: string }) {
  const dots = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return { x: 50 + 43 * Math.cos(a), y: 50 + 43 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 100 100" className={cn("h-20 w-20", className)} aria-hidden>
      <circle cx="50" cy="50" r="48" fill="var(--tpr)" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="var(--g2)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--g2)" strokeWidth="0.8" opacity="0.55" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.6" fill="var(--g1)" />
      ))}
      <g fill="none" stroke="var(--g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 30 L70 50 L50 70 L30 50 Z" />
        <path d="M50 30 C50 20 60 17 63 25 C64.5 30 59 32 57 26" />
        <path d="M50 30 C50 20 40 17 37 25 C35.5 30 41 32 43 26" />
        <path d="M70 50 C80 50 83 40 75 37 C70 35.5 68 41 74 43" />
        <path d="M70 50 C80 50 83 60 75 63 C70 64.5 68 59 74 57" />
        <path d="M50 70 C50 80 60 83 63 75 C64.5 70 59 68 57 74" />
        <path d="M50 70 C50 80 40 83 37 75 C35.5 70 41 68 43 74" />
        <path d="M30 50 C20 50 17 40 25 37 C30 35.5 32 41 26 43" />
        <path d="M30 50 C20 50 17 60 25 63 C30 64.5 32 59 26 57" />
      </g>
      <circle cx="50" cy="50" r="3" fill="var(--g1)" />
    </svg>
  );
}

/** Floral rosette seal (petals around a centre) for soft/romantic templates. */
export function FloralRosette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-20 w-20", className)} aria-hidden>
      <g fill="none" stroke="var(--g2)" strokeWidth="2">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="27"
            rx="7"
            ry="15"
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="9" fill="var(--tpr)" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="var(--g2)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="3" fill="var(--g1)" />
    </svg>
  );
}

/** Floral vine divider (centre bloom + side leaves). Inherits `currentColor`. */
export function FloralDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full items-center justify-center", className)} aria-hidden>
      <svg
        viewBox="0 0 240 24"
        className="h-6 w-full max-w-xs"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <line x1="6" y1="12" x2="96" y2="12" opacity="0.35" />
        <line x1="144" y1="12" x2="234" y2="12" opacity="0.35" />
        <path d="M96 12 c 8 -7, 14 -1, 9 6 c -3 4, -9 1, -6 -4" />
        <path d="M144 12 c -8 -7, -14 -1, -9 6 c 3 4, 9 1, 6 -4" />
        <g transform="translate(120 12)">
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-6"
              rx="2.6"
              ry="6"
              transform={`rotate(${i * 72})`}
            />
          ))}
          <circle cx="0" cy="0" r="1.4" fill="currentColor" stroke="none" />
        </g>
      </svg>
    </div>
  );
}

/** Minimal line divider: a thin rule with a small centre lozenge. */
export function LineDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex w-full items-center justify-center gap-3", className)}
      aria-hidden
    >
      <span className="h-px w-16 bg-current opacity-40" />
      <span className="h-1.5 w-1.5 rotate-45 border border-current" />
      <span className="h-px w-16 bg-current opacity-40" />
    </div>
  );
}

/**
 * Torn / deckled paper edge. Renders a full-width irregular band filled with
 * `currentColor` — set the text colour to the *destination* surface so the
 * paper appears to tear over the photo above it. Use `flip` for a top edge.
 */
export function DeckleEdge({
  className,
  flip,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      className={cn("block w-full", flip && "rotate-180", className)}
      aria-hidden
    >
      {/* faint second tear behind the main one for paper thickness */}
      <path
        fill="currentColor"
        opacity="0.4"
        d="M0 48 L0 16 L34 24 L74 6 L128 22 L176 4 L238 20 L294 8 L356 24 L410 4 L472 20 L540 10 L596 26 L648 6 L716 22 L776 8 L838 24 L900 4 L958 20 L1024 8 L1086 24 L1140 8 L1200 20 L1200 48 Z"
      />
      <path
        fill="currentColor"
        d="M0 48 L0 24 L40 30 L88 12 L146 28 L200 8 L262 26 L320 14 L384 30 L442 10 L506 26 L568 16 L628 30 L688 12 L752 28 L814 14 L876 30 L936 10 L1000 26 L1062 16 L1122 28 L1166 16 L1200 26 L1200 48 Z"
      />
    </svg>
  );
}

/**
 * Hand-drawn heart outline sized to circle a calendar day (≈40×40 box).
 * Deliberately left open at the bottom tip for a "pen sketch" feel — meant to
 * be stroked (fill none), ideally with an animated pathLength draw.
 */
export const HEART_PATH =
  "M20 33.5 C10 25.5 3.5 18.5 5.8 11.2 C7.6 5.6 15 4.2 19.6 9.4 C20.1 10 20.4 10.3 20.7 9.8 C24.6 3.8 32.4 4.8 34.4 10.6 C36.8 17.6 30.5 25 21.2 32.6";

/**
 * Large corner ою-өрнек (qoshqar-muiz fan) for photo-hero overlays — the big
 * translucent ornament drifting in the hero corners. Anchored to the TOP-LEFT
 * corner of its viewBox; rotate in steps of 90° for other corners. Strokes
 * `currentColor`, so tint + opacity come from text colour utilities.
 */
export function KoshkarCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-48 w-48", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* corner fan rings */}
      <path d="M0 88 A88 88 0 0 1 88 0" strokeWidth="1.4" opacity="0.6" />
      <path d="M0 122 A122 122 0 0 1 122 0" strokeWidth="1.2" opacity="0.4" />
      <path d="M0 156 A156 156 0 0 1 156 0" strokeWidth="1" opacity="0.25" />
      {/* central ram's-horn pair on the 45° diagonal */}
      <g strokeWidth="2.4">
        <path d="M16 16 C44 44 62 54 78 50 C96 45 100 26 88 18 C78 11 66 20 74 30 C79 36 88 34 88 26" />
        <path d="M16 16 C44 44 54 62 50 78 C45 96 26 100 18 88 C11 78 20 66 30 74 C36 79 34 88 26 88" />
      </g>
      {/* flanking curls on each axis */}
      <g strokeWidth="1.8" opacity="0.85">
        <path d="M96 4 C110 18 124 22 136 16 C148 10 146 -4 134 -2" />
        <path d="M4 96 C18 110 22 124 16 136 C10 148 -4 146 -2 134" />
        <path d="M130 34 C140 44 152 46 160 40 C168 34 164 24 156 26" />
        <path d="M34 130 C44 140 46 152 40 160 C34 168 24 164 26 156" />
      </g>
      {/* dotted ring accents */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = ((i + 1) * Math.PI) / 16;
        return (
          <circle
            key={i}
            cx={105 * Math.sin(a)}
            cy={105 * Math.cos(a)}
            r="1.8"
            fill="currentColor"
            stroke="none"
            opacity="0.7"
          />
        );
      })}
    </svg>
  );
}
