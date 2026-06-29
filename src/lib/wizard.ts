import { z } from "zod";
import {
  contactSchema,
  programItemSchema,
  type ToiData,
} from "./toi-schema";

/**
 * Form-shaped mirror of the Details step. react-hook-form's useFieldArray
 * wants arrays of objects, so host names are wrapped as `{ value }` here and
 * unwrapped back to `string[]` by `formToToiData`.
 */
export const wizardFormSchema = z.object({
  title: z.string().min(1, "required").max(120),
  hostNames: z.array(z.object({ value: z.string().min(1, "required") })).min(1),
  eventAt: z.string().min(1, "required"),
  venueName: z.string().min(1, "required").max(160),
  address: z.string().max(300).default(""),
  mapUrl: z.union([z.url("url"), z.literal("")]).default(""),
  dressCode: z.string().max(120).default(""),
  program: z.array(programItemSchema).default([]),
  contacts: z.array(contactSchema).default([]),
  customMessage: z.string().max(1000).default(""),
});

// Output = after zod defaults applied (fields required); Input = what the form
// holds while editing (defaulted fields optional). react-hook-form needs both.
export type WizardFormValues = z.output<typeof wizardFormSchema>;
export type WizardFormInput = z.input<typeof wizardFormSchema>;

export const emptyForm: WizardFormInput = {
  title: "",
  hostNames: [{ value: "" }],
  eventAt: "",
  venueName: "",
  address: "",
  mapUrl: "",
  dressCode: "",
  program: [],
  contacts: [],
  customMessage: "",
};

export type Media = { coverPhotoUrl: string; gallery: string[] };

/** Combine the details form + media into the canonical ToiData contract. */
export function formToToiData(form: WizardFormInput, media: Media): ToiData {
  return {
    title: form.title.trim(),
    hostNames: form.hostNames.map((h) => h.value.trim()).filter(Boolean),
    eventAt: form.eventAt,
    venueName: form.venueName.trim(),
    address: form.address?.trim() ?? "",
    mapUrl: form.mapUrl ?? "",
    dressCode: form.dressCode?.trim() ?? "",
    program: form.program ?? [],
    contacts: form.contacts ?? [],
    coverPhotoUrl: media.coverPhotoUrl,
    gallery: media.gallery,
    customMessage: form.customMessage?.trim() ?? "",
  };
}
