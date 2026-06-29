"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useDraft, TOTAL_STEPS } from "@/lib/draft-store";
import { Button } from "@/components/ui/button";
import { Stepper } from "./stepper";
import { StepType } from "./step-type";
import { StepTemplate } from "./step-template";
import { StepDetails, DETAILS_FORM_ID } from "./step-details";
import { StepMedia } from "./step-media";
import { StepPreview } from "./step-preview";
import { StepPublish } from "./step-publish";

export function CreateWizard() {
  const t = useTranslations("Wizard");
  const step = useDraft((s) => s.step);
  const toiType = useDraft((s) => s.toiType);
  const templateId = useDraft((s) => s.templateId);
  const next = useDraft((s) => s.next);
  const prev = useDraft((s) => s.prev);

  // Persisted store rehydrates on the client; render a skeleton until mounted
  // to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <div className="h-8 w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-8 h-64 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  const isPublish = step === TOTAL_STEPS - 1;
  const nextDisabled =
    (step === 0 && !toiType) || (step === 1 && !templateId);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <Stepper current={step} />

      <div className="mt-8">
        {step === 0 && <StepType />}
        {step === 1 && <StepTemplate />}
        {step === 2 && <StepDetails />}
        {step === 3 && <StepMedia />}
        {step === 4 && <StepPreview />}
        {step === 5 && <StepPublish />}
      </div>

      {/* The publish step manages its own back/forward (summary → Kaspi → done). */}
      {!isPublish && (
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>

          {step === 2 ? (
            // Submitting the details form validates, then advances.
            <Button type="submit" form={DETAILS_FORM_ID}>
              {t("next")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={next} disabled={nextDisabled}>
              {t("next")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
