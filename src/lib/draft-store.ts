import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ToiType } from "./toi-schema";
import { emptyForm, type Media, type WizardFormInput } from "./wizard";

// 0 Type · 1 Template · 2 Details · 3 Media · 4 Preview · 5 Publish
export const STEPS = [
  "type",
  "template",
  "details",
  "media",
  "preview",
  "publish",
] as const;
export const TOTAL_STEPS = STEPS.length;

type DraftState = {
  step: number;
  toiType: ToiType | null;
  templateId: string | null;
  form: WizardFormInput;
  media: Media;

  setStep: (step: number) => void;
  next: () => void;
  prev: () => void;
  setType: (t: ToiType) => void;
  setTemplate: (id: string) => void;
  setForm: (form: WizardFormInput) => void;
  setMedia: (patch: Partial<Media>) => void;
  reset: () => void;
};

export const useDraft = create<DraftState>()(
  persist(
    (set, get) => ({
      step: 0,
      toiType: null,
      templateId: null,
      form: emptyForm,
      media: { coverPhotoUrl: "", gallery: [] },

      setStep: (step) => set({ step }),
      next: () => set({ step: Math.min(get().step + 1, TOTAL_STEPS - 1) }),
      prev: () => set({ step: Math.max(get().step - 1, 0) }),
      setType: (toiType) => set({ toiType }),
      setTemplate: (templateId) => set({ templateId }),
      setForm: (form) => set({ form }),
      setMedia: (patch) => set({ media: { ...get().media, ...patch } }),
      reset: () =>
        set({
          step: 0,
          toiType: null,
          templateId: null,
          form: emptyForm,
          media: { coverPhotoUrl: "", gallery: [] },
        }),
    }),
    {
      name: "toiduman-draft",
      version: 1,
      // blob: object URLs from local file previews don't survive a reload.
      partialize: (s) => ({
        step: s.step,
        toiType: s.toiType,
        templateId: s.templateId,
        form: s.form,
      }),
    },
  ),
);
