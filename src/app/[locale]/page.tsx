import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Zap,
  Share2,
  ClipboardCheck,
  Check,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { OrnamentDivider, OrnamentCorner } from "@/components/site/ornament";
import { LAUNCH_PRICE, MARKET_PRICE, formatPrice } from "@/lib/pricing";
import { TOI_TYPES } from "@/lib/toi-schema";
import { TOI_TYPE_META } from "@/lib/toi-type-meta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Features />
      <Types />
      <HowItWorks />
      <Pricing />
    </>
  );
}

function Hero() {
  const t = useTranslations("Hero");
  return (
    <section className="bg-paper">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {t("badge")}
          </span>
          <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-md text-balance text-lg leading-8 text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/create"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/templates"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {t("ctaSecondary")}
            </Link>
          </div>
          <p className="text-sm font-medium text-accent-foreground/80">
            {t("priceFrom", { price: LAUNCH_PRICE })}
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <InvitePreviewCard />
        </div>
      </div>
    </section>
  );
}

/** Decorative sample invitation card — pure visual showcase, not real data. */
function InvitePreviewCard() {
  return (
    <div className="card-premium relative w-full max-w-sm rotate-[-2deg] rounded-2xl p-8 text-center">
      <OrnamentCorner className="absolute left-3 top-3" />
      <OrnamentCorner className="absolute right-3 top-3 rotate-90" />
      <OrnamentCorner className="absolute bottom-3 right-3 rotate-180" />
      <OrnamentCorner className="absolute bottom-3 left-3 -rotate-90" />

      <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
        Той шақыруы
      </p>
      <OrnamentDivider className="my-5" />
      <p className="font-display text-3xl font-bold text-foreground">
        Айдана
      </p>
      <p className="my-1 font-display text-lg text-muted-foreground">&amp;</p>
      <p className="font-display text-3xl font-bold text-foreground">Нұрлан</p>
      <p className="mt-6 text-sm text-muted-foreground">15 тамыз 2026 · Алматы</p>
      <OrnamentDivider className="my-5" />
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
        <Check className="h-3 w-3" /> Сізді тойымызға шақырамыз
      </span>
    </div>
  );
}

function Features() {
  const t = useTranslations("Features");
  const items = [
    { icon: Zap, title: t("fastTitle"), desc: t("fastDesc") },
    { icon: Share2, title: t("shareTitle"), desc: t("shareDesc") },
    { icon: ClipboardCheck, title: t("rsvpTitle"), desc: t("rsvpDesc") },
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight">
        {t("title")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Types() {
  const t = useTranslations("Types");
  const types = TOI_TYPES.filter((type) => type !== "other").map((type) => ({
    emoji: TOI_TYPE_META[type].emoji,
    label: t(TOI_TYPE_META[type].labelKey),
  }));
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          {t("title")}
        </h2>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {types.map(({ emoji, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm"
            >
              <span className="text-base">{emoji}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const steps = [
    { n: 1, title: t("step1Title"), desc: t("step1Desc") },
    { n: 2, title: t("step2Title"), desc: t("step2Desc") },
    { n: 3, title: t("step3Title"), desc: t("step3Desc") },
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight">
        {t("title")}
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        {steps.map(({ n, title, desc }) => (
          <div key={n} className="flex flex-col items-center text-center">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent/15 font-display text-xl font-bold text-accent-foreground">
              {n}
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const t = useTranslations("Pricing");
  const includes = [t("inc1"), t("inc2"), t("inc3"), t("inc4"), t("inc5")];
  return (
    <section id="pricing" className="bg-paper py-16">
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          {t("title")}
        </h2>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>

        <div className="card-premium mx-auto mt-10 max-w-md rounded-2xl p-8">
          <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground ring-1 ring-inset ring-accent/25">
            {t("launchLabel")}
          </span>
          <div className="mt-5 flex items-end justify-center gap-3">
            <span className="font-display text-5xl font-extrabold text-gold">
              {formatPrice(LAUNCH_PRICE)}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="line-through">{formatPrice(MARKET_PRICE)}</span>{" "}
            <span className="text-muted-foreground/80">{t("marketLabel")}</span>
          </p>

          <ul className="mt-8 space-y-3 text-left">
            <li className="mb-1 text-sm font-semibold text-foreground">
              {t("includesTitle")}
            </li>
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/create"
            className={buttonVariants({
              variant: "primary",
              size: "lg",
              className: "mt-8 w-full",
            })}
          >
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
