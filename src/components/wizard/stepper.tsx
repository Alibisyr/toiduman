"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { STEPS } from "@/lib/draft-store";
import { cn } from "@/lib/utils";

const STEP_LABEL_KEYS = [
  "stepType",
  "stepTemplate",
  "stepDetails",
  "stepMedia",
  "stepPreview",
  "stepPublish",
] as const;

export function Stepper({ current }: { current: number }) {
  const t = useTranslations("Wizard");
  return (
    <div>
      <div className="flex items-center">
        {STEPS.map((_, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <div
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors",
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 ? (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i < current ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm font-medium text-muted-foreground">
        {current + 1}. {t(STEP_LABEL_KEYS[current])}
      </p>
    </div>
  );
}
