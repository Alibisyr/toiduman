/**
 * Template registry — derived from the theme configs in `invite-themes`.
 * Each entry is a real, rendered template (status "ready"); the wizard picker
 * and the gallery both read this list.
 */
import { INVITE_THEMES } from "./invite-themes";

export type TemplateMeta = {
  id: string;
  name: string;
  /** Tailwind gradient stops used for the wizard picker swatch. */
  swatch: string;
  /** i18n key under `Templates` for the gallery description. */
  descKey: string;
  status: "ready" | "soon";
};

export const TEMPLATES: TemplateMeta[] = INVITE_THEMES.map((t) => ({
  id: t.id,
  name: t.name,
  swatch: t.swatch,
  descKey: t.descKey,
  status: "ready",
}));

export function getTemplate(id: string | null): TemplateMeta | null {
  return TEMPLATES.find((t) => t.id === id) ?? null;
}
