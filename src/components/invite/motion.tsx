"use client";

/**
 * Framer-motion primitives for the invitation templates — the same patterns
 * popularised by 21st.dev / magicui (BlurFade, letter reveal, sparkles,
 * parallax, ken-burns), tuned for an elegant wedding pace.
 *
 * Everything reads {@link InviteMotion} context: when a template renders with
 * `animate={false}` (gallery thumbnails, the wizard editor) every primitive
 * degrades to a plain static element — no observers, no infinite tweens.
 * `prefers-reduced-motion` is honoured globally via <MotionConfig> plus a
 * manual gate for the ambient (infinite) effects.
 */

import {
  createContext,
  useContext,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const InviteMotion = createContext(false);

/** Slow, elegant default ease — nothing in an invite should snap. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function InviteMotionProvider({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <InviteMotion.Provider value={active}>{children}</InviteMotion.Provider>
    </MotionConfig>
  );
}

/** True when this template opted into animation (and it makes sense to run ambient loops). */
export function useInviteMotion(): boolean {
  const active = useContext(InviteMotion);
  const reduce = useReducedMotion();
  return active && !reduce;
}

/* ── scroll reveals ─────────────────────────────────────────────── */

/**
 * BlurFade: rise + de-blur once, when scrolled into view. The workhorse
 * reveal for every invite section.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  blur = true,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  className?: string;
}) {
  const active = useContext(InviteMotion);
  if (!active) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(6px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Per-letter calligraphy reveal for the hosts' names — letters fade/loosen
 * into place like ink settling. Announces the full text to screen readers.
 */
export function Letters({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const active = useContext(InviteMotion);
  if (!active) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text} role="text">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: "0.35em", rotate: 4, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: delay + i * stagger, ease: EASE }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ── ambient / photo effects ────────────────────────────────────── */

/**
 * Ken-burns hero photograph: an imperceptibly slow push-in, forever. The
 * single biggest "this is alive" cue on a photo hero.
 */
export function KenBurns({
  src,
  filter,
  className,
}: {
  src: string;
  filter?: string;
  className?: string;
}) {
  const ambient = useInviteMotion();
  const style: CSSProperties = { filter };
  const cls = cn("absolute inset-0 h-full w-full object-cover", className);
  /* eslint-disable @next/next/no-img-element */
  if (!ambient) return <img src={src} alt="" className={cls} style={style} />;
  return (
    <motion.img
      src={src}
      alt=""
      className={cls}
      style={style}
      initial={{ scale: 1.02 }}
      animate={{ scale: 1.14 }}
      transition={{ duration: 26, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
    />
  );
  /* eslint-enable @next/next/no-img-element */
}

/** Scroll-linked vertical parallax for a photo band's backdrop. */
export function Parallax({
  children,
  range = 60,
  className,
}: {
  children: ReactNode;
  /** Total px the layer travels while the band crosses the viewport. */
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInviteMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  // Keep the ref attached even when static — useScroll above targets it and
  // throws "target ref not hydrated" if it never mounts.
  if (!active)
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/** Slow levitation for decorative ornaments (corner ою, seals). */
export function Drift({
  children,
  className,
  duration = 9,
  x = 6,
  y = 10,
  rotate = 2,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  x?: number;
  y?: number;
  rotate?: number;
  delay?: number;
}) {
  const ambient = useInviteMotion();
  if (!ambient) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ x: [0, x, 0], y: [0, y, 0], rotate: [0, rotate, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ── gold dust ──────────────────────────────────────────────────── */

/** Deterministic PRNG so the particle field is stable across SSR + renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Floating gold dust over a hero/footer. Sized/positioned deterministically;
 * each mote twinkles and drifts upward on its own rhythm.
 */
export function Sparkles({
  count = 18,
  color = "var(--g1, #f3e3ac)",
  seed = 7,
  className,
}: {
  count?: number;
  color?: string;
  seed?: number;
  className?: string;
}) {
  const ambient = useInviteMotion();
  if (!ambient) return null;
  const rnd = mulberry32(seed);
  const motes = Array.from({ length: count }, () => ({
    left: 4 + rnd() * 92,
    top: 8 + rnd() * 84,
    size: 1.5 + rnd() * 2.6,
    dur: 3.4 + rnd() * 4.2,
    delay: rnd() * 5,
    rise: 10 + rnd() * 26,
  }));
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: color,
            boxShadow: `0 0 ${m.size * 3}px ${m.size / 2}px ${color}`,
          }}
          animate={{ opacity: [0, 1, 0], y: [0, -m.rise] }}
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── stroke drawing ─────────────────────────────────────────────── */

/**
 * Draws an SVG path when it scrolls into view — the hand-drawn heart around
 * the calendar date, ornament linework, etc. Wrap in an <svg> yourself.
 */
export function DrawPath({
  d,
  stroke = "var(--tac)",
  strokeWidth = 2.4,
  duration = 1.4,
  delay = 0,
}: {
  d: string;
  stroke?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
}) {
  const active = useContext(InviteMotion);
  const common = {
    d,
    fill: "none",
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (!active) return <path {...common} />;
  return (
    <motion.path
      {...common}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={{ duration, delay, ease: EASE }}
    />
  );
}
