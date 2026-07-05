import { z } from "zod";

/**
 * The Toiduman data contract.
 *
 * This is the single source of truth shared by:
 *  - the create-a-toi wizard (form validation),
 *  - the public invitation renderer + templates (read shape),
 *  - the friend's Supabase `toi_details` table (mirror these columns).
 *
 * Keep changes additive and backwards-compatible so existing templates and
 * stored invites keep rendering.
 */

export const TOI_TYPES = [
  "wedding", // үйлену тойы
  "kyz_uzatu", // қыз ұзату
  "kudalyk", // құда түсу / сырға салу
  "betashar", // беташар
  "shildehana", // шілдехана
  "besik_toi", // бесік той
  "tusau_kesu", // тұсау кесу
  "sundet", // сүндет той
  "mushel", // мүшел той
  "birthday", // туған күн
  "anniversary", // мерейтой
  "other",
] as const;

export const toiTypeSchema = z.enum(TOI_TYPES);
export type ToiType = (typeof TOI_TYPES)[number];

export const SUPPORTED_LOCALES = ["kk", "ru"] as const;
export const localeSchema = z.enum(SUPPORTED_LOCALES);

/** Optional URL: a valid URL or an empty string (unfilled field). */
const optionalUrl = z.union([z.url(), z.literal("")]);

export const contactSchema = z.object({
  name: z.string().min(1).max(80),
  phone: z.string().min(1).max(40),
});
export type Contact = z.infer<typeof contactSchema>;

/**
 * Program-item kinds. Drive the icon shown next to each timeline row in the
 * invite. `kind` is optional and additive — older invites without it fall back
 * to keyword inference (see `inferProgramKind`) and finally a neutral icon.
 */
export const PROGRAM_KINDS = [
  "welcome", // қонақтарды қарсы алу / встреча гостей (reception)
  "ceremony", // неке қию / роспись (marriage)
  "betashar", // беташар (bride-unveiling rite)
  "banquet", // салтанатты ас / банкет (dinner)
  "toast", // тілек / тост
  "dance", // той-думан / танцы
  "gift", // сыйлық
  "photo", // фотосессия
  "other",
] as const;
export const programKindSchema = z.enum(PROGRAM_KINDS);
export type ProgramKind = (typeof PROGRAM_KINDS)[number];

export const programItemSchema = z.object({
  time: z.string().max(20).optional(), // e.g. "18:00"
  title: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
  /** Optional event kind → picks the timeline icon. */
  kind: programKindSchema.optional(),
});
export type ProgramItem = z.infer<typeof programItemSchema>;

export const toiDataSchema = z.object({
  /** Headline of the invite, e.g. "Үйлену тойы". */
  title: z.string().min(1).max(120),
  /** Hosts / guests of honour, e.g. ["Айдана", "Нұрлан"]. */
  hostNames: z.array(z.string().min(1).max(80)).min(1).max(6),
  /** Event date-time as an ISO 8601 string. */
  eventAt: z.string().min(1),
  venueName: z.string().min(1).max(160),
  address: z.string().max(300).default(""),
  mapUrl: optionalUrl.default(""),
  dressCode: z.string().max(120).default(""),
  /** Dress-code palette: CSS colour strings rendered as swatch circles. */
  dressColors: z.array(z.string().max(40)).max(8).default([]),
  program: z.array(programItemSchema).max(20).default([]),
  contacts: z.array(contactSchema).max(10).default([]),
  coverPhotoUrl: optionalUrl.default(""),
  /** Background music for the hero player button (autoplay is blocked, so the
   *  guest taps to play). Any audio URL. */
  musicUrl: optionalUrl.default(""),
  gallery: z.array(z.url()).max(30).default([]),
  customMessage: z.string().max(1000).default(""),
  /** Per-invite theme tweaks (e.g. { primary: "#1c6b72" }). */
  themeOverrides: z.record(z.string(), z.string()).optional(),
});

export type ToiData = z.infer<typeof toiDataSchema>;

/** Blank starting point for the wizard. */
export const emptyToiData: ToiData = {
  title: "",
  hostNames: [""],
  eventAt: "",
  venueName: "",
  address: "",
  mapUrl: "",
  dressCode: "",
  dressColors: [],
  program: [],
  contacts: [],
  coverPhotoUrl: "",
  musicUrl: "",
  gallery: [],
  customMessage: "",
};

/**
 * Best-effort guess of a program item's kind from its title, for invites whose
 * rows have no explicit `kind`. Matches both Kazakh and Russian keywords.
 */
export function inferProgramKind(title: string): ProgramKind {
  const s = title.toLowerCase();
  if (/беташар|betashar/.test(s)) return "betashar";
  if (/неке|қию|nika|никах|роспись|загс|қиыл/.test(s)) return "ceremony";
  if (/қарсы|күту|встреч|сбор|reception|welcome|жинал/.test(s)) return "welcome";
  if (/ас\b|дастарх|банкет|ужин|обед|тамақ|dinner|той\b/.test(s))
    return "banquet";
  if (/думан|би|танц|disco|дискотек|dance/.test(s)) return "dance";
  if (/тілек|тост|сөз|toast|речь/.test(s)) return "toast";
  if (/сыйлық|подар|gift/.test(s)) return "gift";
  if (/фото|photo|сесси/.test(s)) return "photo";
  return "other";
}
