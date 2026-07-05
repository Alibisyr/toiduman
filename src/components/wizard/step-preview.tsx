"use client";

import { useLocale, useTranslations } from "next-intl";
import { useDraft } from "@/lib/draft-store";
import { formToToiData } from "@/lib/wizard";
import { InviteTemplate } from "@/components/invite/invite-template";
import { StepHeading } from "./step-heading";

export function StepPreview() {
  const t = useTranslations("Wizard");
  const locale = useLocale();
  const form = useDraft((s) => s.form);
  const media = useDraft((s) => s.media);
  const data = formToToiData(form, media);

  return (
    <div>
      <StepHeading title={t("previewTitle")} subtitle={t("previewSubtitle")} />
      <InviteTemplate data={data} locale={locale} animate={false} />
      <p className="mt-6 text-center text-xs text-muted-foreground">
        {t("previewNote")}
      </p>
    </div>
  );
}
