import type { CSSProperties } from "react";

/**
 * Invitation template themes. A "template" is an art direction: a palette,
 * background photography, and a few discriminators (name typography /
 * ornament flavour / section edge). <InviteTemplate> reads `cssVars` onto its
 * root and switches structure on the discriminators, so adding a template =
 * adding a config here. All render the same `ToiData`.
 */

export type OrnamentStyle = "nomad" | "floral" | "line" | "none";
/** How the hosts' names are set in the hero. */
export type NameStyle = "script" | "serif" | "caps";
/** Transition from the photo hero into the paper body. */
export type EdgeStyle = "torn" | "lace" | "flat";

export type TemplateArt = {
  /** Full-bleed hero photo (public/ path). Omit for a pure-typography hero. */
  hero?: string;
  /** Photo behind the venue band. Falls back to the primary panel. */
  band?: string;
  /** Photo behind the closing section. */
  footer?: string;
  /** CSS filter applied to every photo (e.g. duotone for `modern`). */
  filter?: string;
  /** Scrim painted over photos, under the text. */
  overlay: string;
};

export type TemplateTheme = {
  id: string;
  /** Display name (already localized-feeling Kazakh word; same in both UIs). */
  name: string;
  /** i18n key under `Templates` for the gallery description. */
  descKey: string;
  /** Tailwind gradient stops for the wizard picker / fallback swatch. */
  swatch: string;
  nameStyle: NameStyle;
  ornament: OrnamentStyle;
  edge: EdgeStyle;
  /** Corner radius for the card + inner cards. */
  radius: string;
  art: TemplateArt;
  /** Custom properties applied to the template root. */
  cssVars: CSSProperties;
};

function vars(v: {
  bg: string;
  tp: string;
  tp2: string;
  ti: string;
  ts: string;
  tl: string;
  tpr: string;
  top: string;
  tac: string;
  g1: string;
  g2: string;
  g3: string;
}): CSSProperties {
  return {
    "--tb": v.bg,
    "--tp": v.tp,
    "--tp2": v.tp2,
    "--ti": v.ti,
    "--ts": v.ts,
    "--tl": v.tl,
    "--tpr": v.tpr,
    "--top": v.top,
    "--tac": v.tac,
    "--g1": v.g1,
    "--g2": v.g2,
    "--g3": v.g3,
  } as CSSProperties;
}

export const INVITE_THEMES: TemplateTheme[] = [
  {
    // Theme 1 — "Premium Neo-Nomad" flagship. Golden-steppe photography under
    // a deep-emerald scrim, warm cream paper cards, brand metallic-gold
    // linework (matches the marketing site's design language exactly).
    id: "dala",
    name: "Дала",
    descKey: "desc_dala",
    swatch: "from-[#0f5d48] to-[#14755b]",
    nameStyle: "script",
    ornament: "nomad",
    edge: "torn",
    radius: "2rem",
    art: {
      hero: "/invite/dala-hero.jpg",
      band: "/invite/dala-hero.jpg",
      overlay:
        "linear-gradient(180deg, rgba(9,42,33,0.38) 0%, rgba(9,38,30,0.28) 38%, rgba(8,36,28,0.62) 74%, rgba(7,34,27,0.85) 100%)",
    },
    cssVars: vars({
      bg: "#f5eddf",
      tp: "#fffdf8",
      tp2: "#efe6d6",
      ti: "#241d14",
      ts: "#6c6253",
      tl: "#e7dcc7",
      tpr: "#0f5d48", // deep corporate emerald (locked)
      top: "#f7f1e6",
      tac: "#6e2a3f", // velvet burgundy accent
      g1: "#f3e3ac", // metallic gold highlight
      g2: "#d4af37", // true brand gold
      g3: "#976f1c", // deep gold / shadow
    }),
  },
  {
    // Rust-red desert mountains under a burgundy scrim — the "classic toi"
    // red-and-gold, done with atmosphere instead of flat colour.
    id: "qyzyl",
    name: "Қызыл",
    descKey: "desc_qyzyl",
    swatch: "from-[#7a1f2b] to-[#a8434f]",
    nameStyle: "script",
    ornament: "nomad",
    edge: "lace",
    radius: "1rem",
    art: {
      hero: "/invite/qyzyl-hero.jpg",
      band: "/invite/qyzyl-hero.jpg",
      overlay:
        "linear-gradient(180deg, rgba(64,14,20,0.42) 0%, rgba(58,13,19,0.30) 40%, rgba(52,11,17,0.66) 76%, rgba(46,10,15,0.88) 100%)",
    },
    cssVars: vars({
      bg: "#f1e7dd",
      tp: "#fffaf3",
      tp2: "#f7e9e1",
      ti: "#311317",
      ts: "#7c5d5f",
      tl: "#ecd6cc",
      tpr: "#7a1f2b",
      top: "#fdf2ec",
      tac: "#b9882b",
      g1: "#f0d9a0",
      g2: "#c79a3c",
      g3: "#8a6a1f",
    }),
  },
  {
    // Pure-typography luxury: ivory silk, gold-foil serif, double hairline
    // frame. The one theme with no photography — print-shop elegance.
    id: "altyn",
    name: "Алтын",
    descKey: "desc_altyn",
    swatch: "from-[#b1872c] to-[#e6cd8f]",
    nameStyle: "serif",
    ornament: "line",
    edge: "flat",
    radius: "0.4rem",
    art: {
      overlay: "none",
    },
    cssVars: vars({
      bg: "#f9f5ec",
      tp: "#ffffff",
      tp2: "#f7f1e4",
      ti: "#2a251d",
      ts: "#8c8473",
      tl: "#e7dcc4",
      tpr: "#232019",
      top: "#fbf7ee",
      tac: "#b1872c",
      g1: "#e6cd8f",
      g2: "#b1872c",
      g3: "#856220",
    }),
  },
  {
    // Milky way over snowy peaks; the whole invite stays midnight-dark with
    // starlight-gold accents. Footer returns to a purple starry horizon.
    id: "tun",
    name: "Түн",
    descKey: "desc_tun",
    swatch: "from-[#14120d] to-[#3a3320]",
    nameStyle: "script",
    ornament: "nomad",
    edge: "torn",
    radius: "1.5rem",
    art: {
      hero: "/invite/tun-hero.jpg",
      band: "/invite/tun-stars.jpg",
      footer: "/invite/tun-stars.jpg",
      overlay:
        "linear-gradient(180deg, rgba(9,10,20,0.30) 0%, rgba(9,10,20,0.22) 40%, rgba(10,10,18,0.66) 78%, rgba(11,10,16,0.90) 100%)",
    },
    cssVars: vars({
      bg: "#14120d",
      tp: "#1d1a13",
      tp2: "#232017",
      ti: "#f2ead6",
      ts: "#b4a787",
      tl: "#39321f",
      tpr: "#123c33",
      top: "#f4ecd8",
      tac: "#d9b45c",
      g1: "#e8cd86",
      g2: "#cda758",
      g3: "#9c7e38",
    }),
  },
  {
    // Cherry blossom in full bloom under a soft rose scrim — the romantic,
    // floral one (qyz uzatu / spring weddings).
    id: "gul",
    name: "Гүл",
    descKey: "desc_gul",
    swatch: "from-[#a85a63] to-[#d39aa0]",
    nameStyle: "script",
    ornament: "floral",
    edge: "torn",
    radius: "1.75rem",
    art: {
      hero: "/invite/gul-hero.jpg",
      band: "/invite/gul-hero.jpg",
      overlay:
        "linear-gradient(180deg, rgba(88,36,44,0.48) 0%, rgba(88,36,44,0.38) 40%, rgba(74,30,38,0.68) 76%, rgba(64,26,33,0.86) 100%)",
    },
    cssVars: vars({
      bg: "#fbf1ee",
      tp: "#fffafa",
      tp2: "#f7ece9",
      ti: "#4a2f33",
      ts: "#97757a",
      tl: "#f0dcd7",
      tpr: "#a85a63",
      top: "#fff6f5",
      tac: "#7e8a66",
      g1: "#e9c7a0",
      g2: "#c89a6e",
      g3: "#9c6f4c",
    }),
  },
  {
    // Editorial black-and-white: a galloping steppe horse duotoned to
    // charcoal, huge grotesque caps, one hot terracotta accent.
    id: "modern",
    name: "Заманауи",
    descKey: "desc_modern",
    swatch: "from-[#17170f] to-[#c0492b]",
    nameStyle: "caps",
    ornament: "none",
    edge: "flat",
    radius: "0rem",
    art: {
      hero: "/invite/modern-hero.jpg",
      filter: "grayscale(1) contrast(1.1) brightness(0.9)",
      overlay:
        "linear-gradient(180deg, rgba(18,18,15,0.30) 0%, rgba(18,18,15,0.22) 42%, rgba(16,16,13,0.68) 78%, rgba(14,14,12,0.92) 100%)",
    },
    cssVars: vars({
      bg: "#f3f3ef",
      tp: "#ffffff",
      tp2: "#eceae3",
      ti: "#17170f",
      ts: "#6a685e",
      tl: "#e1dfd6",
      tpr: "#17170f",
      top: "#fafaf7",
      tac: "#c0492b",
      g1: "#d98b73",
      g2: "#c0492b",
      g3: "#9a3a22",
    }),
  },
];

export const DEFAULT_THEME = INVITE_THEMES[0];

export function getTheme(id: string | null | undefined): TemplateTheme {
  return INVITE_THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;
}
