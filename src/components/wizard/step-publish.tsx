"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useDraft } from "@/lib/draft-store";
import { formToToiData } from "@/lib/wizard";
import { makeSlug, makeEditToken, makeOrderRef } from "@/lib/slug";
import { saveToi } from "@/lib/device-tois";
import { LAUNCH_PRICE, MARKET_PRICE, formatPrice } from "@/lib/pricing";
import { KASPI, kaspiQrValue } from "@/lib/kaspi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StepHeading } from "./step-heading";

type Order = { slug: string; editToken: string; orderRef: string };
type Screen = "summary" | "kaspi" | "done";

export function StepPublish() {
  const t = useTranslations("Wizard");
  const locale = useLocale();
  const form = useDraft((s) => s.form);
  const media = useDraft((s) => s.media);
  const toiType = useDraft((s) => s.toiType);
  const templateId = useDraft((s) => s.templateId);
  const reset = useDraft((s) => s.reset);
  const prev = useDraft((s) => s.prev);

  const [screen, setScreen] = useState<Screen>("summary");
  const [order, setOrder] = useState<Order | null>(null);
  const [paying, setPaying] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  function goToKaspi() {
    const data = formToToiData(form, media);
    const names = data.hostNames.length ? data.hostNames : [data.title || "toi"];
    setOrder({
      slug: makeSlug(names),
      editToken: makeEditToken(),
      orderRef: makeOrderRef(),
    });
    setScreen("kaspi");
  }

  async function confirmPaid() {
    if (!order) return;
    setPaying(true);
    // TODO(backend): verify the Kaspi transfer (Business API / webhook) before
    // releasing the link. For now we trust the confirmation and publish locally.
    await new Promise((r) => setTimeout(r, 1200));
    const data = formToToiData(form, media);
    saveToi({
      id: order.editToken,
      slug: order.slug,
      editToken: order.editToken,
      title: data.title || data.hostNames.join(" & "),
      type: toiType ?? "other",
      templateId: templateId ?? "classic",
      createdAt: new Date().toISOString(),
      data,
    });
    setPaying(false);
    setScreen("done");
  }

  // ---- Success: reveal links ----
  if (screen === "done" && order) {
    const links = [
      {
        key: "public",
        label: t("publicLinkLabel"),
        url: `${origin}/${locale}/i/${order.slug}`,
        secret: false,
        hint: "",
      },
      {
        key: "manage",
        label: t("manageLinkLabel"),
        url: `${origin}/${locale}/m/${order.editToken}`,
        secret: true,
        hint: t("manageHint"),
      },
    ];

    return (
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">
          {t("successTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("successSubtitle")}
        </p>

        <div className="mx-auto mt-8 max-w-md space-y-5 text-left">
          {links.map((l) => (
            <div key={l.key}>
              <div className="mb-1.5 flex items-center gap-1.5">
                <Label className="mb-0">{l.label}</Label>
                {l.secret ? (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                ) : null}
              </div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={l.url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="h-11 w-full rounded-lg border border-input bg-muted px-3 text-sm text-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copy(l.key, l.url)}
                  aria-label={t("copy")}
                >
                  {copied === l.key ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {l.hint ? (
                <p className="mt-1 text-xs text-muted-foreground">{l.hint}</p>
              ) : null}
            </div>
          ))}
        </div>

        <Button variant="outline" className="mt-8" onClick={() => reset()}>
          {t("createAnother")}
        </Button>
      </div>
    );
  }

  // ---- Kaspi payment instructions ----
  if (screen === "kaspi" && order) {
    const steps = [
      t("payStep1"),
      t("payStep2", { amount: formatPrice(LAUNCH_PRICE) }),
      t("payStep3"),
    ];
    return (
      <div>
        <StepHeading
          title={t("payHeading")}
          subtitle={t("payInstruction")}
        />

        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-center text-xs uppercase tracking-wide text-muted-foreground">
            {t("amount")}
          </p>
          <p className="text-center font-display text-4xl font-extrabold">
            {formatPrice(LAUNCH_PRICE)}
          </p>

          <div className="my-6 flex justify-center">
            <div className="rounded-xl border border-border bg-white p-3">
              <QRCodeSVG
                value={kaspiQrValue()}
                size={168}
                fgColor="#1c6b72"
                bgColor="#ffffff"
                level="M"
              />
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            {t("scanQr")}
          </p>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("orLabel")}
            <span className="h-px flex-1 bg-border" />
          </div>

          <PayRow
            label={t("numberLabel")}
            value={KASPI.number}
            sub={`${t("recipient")}: ${KASPI.name}`}
            onCopy={() => copy("kaspi", KASPI.number)}
            copied={copied === "kaspi"}
            copyLabel={t("copy")}
          />
          <div className="mt-3">
            <PayRow
              label={t("refLabel")}
              value={order.orderRef}
              onCopy={() => copy("ref", order.orderRef)}
              copied={copied === "ref"}
              copyLabel={t("copy")}
            />
            <p className="mt-1 text-xs text-muted-foreground">{t("refHint")}</p>
          </div>

          <ol className="mt-6 space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{s}</span>
              </li>
            ))}
          </ol>

          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={confirmPaid}
            disabled={paying}
          >
            {paying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("verifying")}
              </>
            ) : (
              t("iPaid")
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("paymentNote")}
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setScreen("summary")}
            disabled={paying}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        </div>
      </div>
    );
  }

  // ---- Summary + start payment ----
  return (
    <div className="text-center">
      <StepHeading title={t("publishTitle")} subtitle={t("publishSubtitle")} />
      <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <span className="font-display text-4xl font-extrabold">
          {formatPrice(LAUNCH_PRICE)}
        </span>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="line-through">{formatPrice(MARKET_PRICE)}</span>
        </p>
        <Button className="mt-6 w-full" size="lg" onClick={goToKaspi}>
          {t("pay", { price: LAUNCH_PRICE })}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          {t("securedKaspi")}
        </p>
      </div>

      <div className="mt-6">
        <Button variant="ghost" onClick={() => prev()}>
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
      </div>
    </div>
  );
}

function PayRow({
  label,
  value,
  sub,
  onCopy,
  copied,
  copyLabel,
}: {
  label: string;
  value: string;
  sub?: string;
  onCopy: () => void;
  copied: boolean;
  copyLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-display text-lg font-bold">{value}</p>
        {sub ? (
          <p className="truncate text-xs text-muted-foreground">{sub}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCopy}
        aria-label={copyLabel}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
