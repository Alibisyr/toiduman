"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { useDraft } from "@/lib/draft-store";
import { cn } from "@/lib/utils";
import { StepHeading } from "./step-heading";

export function StepTemplate() {
  const t = useTranslations("Wizard");
  const templateId = useDraft((s) => s.templateId);
  const setTemplate = useDraft((s) => s.setTemplate);

  return (
    <div>
      <StepHeading title={t("templateTitle")} subtitle={t("templateSubtitle")} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {TEMPLATES.map((tpl) => {
          const selected = templateId === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setTemplate(tpl.id)}
              aria-pressed={selected}
              className={cn(
                "group overflow-hidden rounded-xl border bg-card text-left transition-all",
                selected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div
                className={cn(
                  "relative flex aspect-[3/4] items-center justify-center bg-gradient-to-br",
                  tpl.swatch,
                )}
              >
                <span className="font-display text-lg font-bold tracking-[0.2em] text-white/90">
                  ТОЙ
                </span>
                {selected ? (
                  <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-white text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
              <div className="px-3 py-2 text-sm font-medium">{tpl.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
