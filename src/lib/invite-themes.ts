import type { CSSProperties } from "react";

/**
 * Invitation template themes. A "template" is a theme config: a palette plus
 * a few layout discriminators (hero / ornament / surface). <InviteTemplate>
 * reads `cssVars` onto its root and switches structure on the discriminators,
 * so adding a template = adding a config here. All render the same `ToiData`.
 */

export type HeroStyle = "stage" | "band" | "arch" | "minimal" | "split";
export type OrnamentStyle = "nomad" | "floral" | "line" | "none";
export type SurfaceStyle = "band" | "card" | "flat";

export type TemplateTheme = {
  id: string;
  /** Display name (already localized-feeling Kazakh word; same in both UIs). */
  name: string;
  /** i18n key under `Templates` for the gallery description. */
  descKey: string;
  /** Tailwind gradient stops for the wizard picker / fallback swatch. */
  swatch: string;
  hero: HeroStyle;
  ornament: OrnamentStyle;
  surface: SurfaceStyle;
  /** Corner radius for the card + inner cards. */
  radius: string;
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
    id: "dala",
    name: "Дала",
    descKey: "desc_dala",
    swatch: "from-[#0f5d48] to-[#14755b]",
    hero: "stage",
    ornament: "nomad",
    surface: "band",
    radius: "2rem",
    cssVars: vars({
      bg: "#f5eddf",
      tp: "#fffdf8",
      tp2: "#efe6d6",
      ti: "#241d14",
      ts: "#6c6253",
      tl: "#e7dcc7",
      tpr: "#0f5d48",
      top: "#f7f1e6",
      tac: "#7a2331",
      g1: "#ecd699",
      g2: "#c79a3c",
      g3: "#8f6b1f",
    }),
  },
  {
    id: "qyzyl",
    name: "Қызыл",
    descKey: "desc_qyzyl",
    swatch: "from-[#7a1f2b] to-[#a8434f]",
    hero: "band",
    ornament: "nomad",
    surface: "band",
    radius: "1rem",
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
    id: "altyn",
    name: "Алтын",
    descKey: "desc_altyn",
    swatch: "from-[#b1872c] to-[#e6cd8f]",
    hero: "minimal",
    ornament: "line",
    surface: "flat",
    radius: "0.4rem",
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
    id: "tun",
    name: "Түн",
    descKey: "desc_tun",
    swatch: "from-[#14120d] to-[#3a3320]",
    hero: "stage",
    ornament: "nomad",
    surface: "band",
    radius: "1.5rem",
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
    id: "gul",
    name: "Гүл",
    descKey: "desc_gul",
    swatch: "from-[#a85a63] to-[#d39aa0]",
    hero: "arch",
    ornament: "floral",
    surface: "card",
    radius: "1.75rem",
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
    id: "modern",
    name: "Заманауи",
    descKey: "desc_modern",
    swatch: "from-[#17170f] to-[#c0492b]",
    hero: "split",
    ornament: "none",
    surface: "flat",
    radius: "0rem",
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
