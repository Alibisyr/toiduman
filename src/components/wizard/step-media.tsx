"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Plus, X } from "lucide-react";
import { useDraft } from "@/lib/draft-store";
import { Label } from "@/components/ui/label";
import { StepHeading } from "./step-heading";

export function StepMedia() {
  const t = useTranslations("Wizard");
  const media = useDraft((s) => s.media);
  const setMedia = useDraft((s) => s.setMedia);

  return (
    <div className="space-y-6">
      <StepHeading title={t("mediaTitle")} subtitle={t("mediaSubtitle")} />

      <p className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        {t("uploadNote")}
      </p>

      <div>
        <Label>{t("cover")}</Label>
        <p className="mb-2 text-xs text-muted-foreground">{t("coverHint")}</p>
        <CoverUpload
          value={media.coverPhotoUrl}
          onChange={(url) => setMedia({ coverPhotoUrl: url })}
          chooseLabel={t("choose")}
          removeLabel={t("removeImage")}
        />
      </div>

      <div>
        <Label>{t("gallery")}</Label>
        <p className="mb-2 text-xs text-muted-foreground">{t("galleryHint")}</p>
        <GalleryUpload
          value={media.gallery}
          onChange={(g) => setMedia({ gallery: g })}
        />
      </div>
    </div>
  );
}

function CoverUpload({
  value,
  onChange,
  chooseLabel,
  removeLabel,
}: {
  value: string;
  onChange: (url: string) => void;
  chooseLabel: string;
  removeLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onChange(URL.createObjectURL(file));
    e.target.value = "";
  }

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="h-44 w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={removeLabel}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground"
      >
        <ImagePlus className="h-6 w-6" />
        {chooseLabel}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={pick}
      />
    </>
  );
}

function GalleryUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (g: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map((f) => URL.createObjectURL(f));
    onChange([...value, ...urls]);
    e.target.value = "";
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((src, i) => (
          <div key={i} className="relative aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="h-full w-full rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={pick}
      />
    </>
  );
}
