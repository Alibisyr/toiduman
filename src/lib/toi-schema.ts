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

export const programItemSchema = z.object({
  time: z.string().max(20).optional(), // e.g. "18:00"
  title: z.string().min(1).max(120),
  description: z.string().max(300).optional(),
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
  program: z.array(programItemSchema).max(20).default([]),
  contacts: z.array(contactSchema).max(10).default([]),
  coverPhotoUrl: optionalUrl.default(""),
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
  program: [],
  contacts: [],
  coverPhotoUrl: "",
  gallery: [],
  customMessage: "",
};
