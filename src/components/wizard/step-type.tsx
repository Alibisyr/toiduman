"use client";

import { useTranslations } from "next-intl";
import { TOI_TYPES } from "@/lib/toi-schema";
import { TOI_TYPE_META } from "@/lib/toi-type-meta";
import { useDraft } from "@/lib/draft-store";
import { cn } from "@/lib/utils";
import { StepHeading } from "./step-heading";

export function StepType() {
  const tw = useTranslations("Wizard");
  const tt = useTranslations("Types");
  const toiType = useDraft((s) => s.toiType);
  const setType = useDraft((s) => s.setType);

  return (
    <div>
      <StepHeading title={tw("typeTitle")} subtitle={tw("typeSubtitle")} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TOI_TYPES.map((type) => {
          const meta = TOI_TYPE_META[type];
          const selected = toiType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setType(type)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors",
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span className="text-3xl">{meta.emoji}</span>
              <span className="text-sm font-medium">{tt(meta.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
