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
import {
  KazakhOrnament,
  OrnamentRibbon,
  DrawableOrnament,
} from "@/components/site/kazakh-ornaments";
import { ScrollChoreography } from "@/components/site/scroll-choreography";
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
      <ScrollChoreography />
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
    <section className="relative overflow-hidden bg-paper">
      {/* Massive tree-of-life watermark anchored to the left edge. */}
      <KazakhOrnament
        name="treeOfLife"
        className="ornament-layer -left-28 top-1/2 hidden h-[130%] w-auto -translate-y-1/2 text-secondary/[0.06] sm:block"
      />
      {/* Faint gold medallion floating top-right. */}
      <KazakhOrnament
        name="medallion"
        className="ornament-layer -right-24 -top-20 h-80 w-80 text-accent/[0.09]"
      />
      {/* Gold linework that "draws" itself on as the page loads. */}
      <DrawableOrnament
        name="medallion"
        onLoad
        strokeWidth={1.5}
        className="ornament-layer -right-16 top-1/2 hidden h-[44rem] w-[44rem] -translate-y-1/2 text-accent/35 lg:block"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-24">
        <div className="flex flex-col items-start gap-6">
          <span
            data-hero-reveal
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {t("badge")}
          </span>
          <h1
            data-hero-reveal
            className="text-balance font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl"
          >
            {t("title")}
          </h1>
          <p
            data-hero-reveal
            className="max-w-md text-balance text-lg leading-8 text-muted-foreground"
          >
            {t("subtitle")}
          </p>
          <div
            data-hero-reveal
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
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
          <p
            data-hero-reveal
            className="text-sm font-medium text-accent-foreground/80"
          >
            {t("priceFrom", { price: LAUNCH_PRICE })}
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div data-hero-card>
            <InvitePreviewCard />
          </div>
        </div>
      </div>

      {/* Gold ою ribbon grounding the hero and leading into the page. */}
      <OrnamentRibbon className="absolute inset-x-0 bottom-0 z-10 h-9 opacity-40" />
    </section>
  );
}

/** Decorative sample invitation card — pure visual showcase, not real data. */
function InvitePreviewCard() {
  return (
    <div className="card-premium relative w-full max-w-sm overflow-hidden rotate-[-2deg] rounded-2xl p-8 text-center">
      {/* Symmetric tört-құлақ medallion sitting behind the names. */}
      <KazakhOrnament
        name="medallion"
        className="ornament-layer left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 text-accent/[0.07]"
      />
      <OrnamentCorner className="absolute left-3 top-3 z-10" />
      <OrnamentCorner className="absolute right-3 top-3 z-10 rotate-90" />
      <OrnamentCorner className="absolute bottom-3 right-3 z-10 rotate-180" />
      <OrnamentCorner className="absolute bottom-3 left-3 z-10 -rotate-90" />

      <div className="relative z-10">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Той шақыруы
        </p>
        <OrnamentDivider className="my-5" />
        <p className="font-display text-3xl font-bold text-foreground">
          Айдана
        </p>
        <p className="my-1 font-display text-lg text-muted-foreground">&amp;</p>
        <p className="font-display text-3xl font-bold text-foreground">
          Нұрлан
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          15 тамыз 2026 · Алматы
        </p>
        <OrnamentDivider className="my-5" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
          <Check className="h-3 w-3" /> Сізді тойымызға шақырамыз
        </span>
      </div>
    </div>
  );
}

function Features() {
  const t = useTranslations("Features");
  const items = [
    {
      icon: Zap,
      title: t("fastTitle"),
      desc: t("fastDesc"),
      ornament: "leaf" as const,
    },
    {
      icon: Share2,
      title: t("shareTitle"),
      desc: t("shareDesc"),
      ornament: "camelNeck" as const,
    },
    {
      icon: ClipboardCheck,
      title: t("rsvpTitle"),
      desc: t("rsvpDesc"),
      ornament: "camelFoot" as const,
    },
  ];
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading>{t("title")}</SectionHeading>
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, desc, ornament }) => (
          <div
            key={title}
            data-card
            className="group relative overflow-hidden rounded-xl border border-accent/20 bg-card p-6 shadow-premium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45"
          >
            <KazakhOrnament
              name={ornament}
              className="ornament-layer -right-6 -top-6 h-28 w-28 rotate-12 text-accent/15 transition-all duration-500 group-hover:rotate-0 group-hover:text-accent/30"
            />
            <div className="relative z-10">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">
                {title}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Centered section heading with a gold-rule + camel's-foot flourish beneath it.
 * Decoration only — wraps the existing <h2> (and optional subtitle) text.
 */
function SectionHeading({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div data-reveal className="mb-10 flex flex-col items-center">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight">
        {children}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-prose text-center text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-5 flex items-center gap-3 text-accent">
        <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,var(--gold-2))]" />
        <KazakhOrnament name="camelNeck" className="h-5 w-5 -scale-x-100 text-accent/80" />
        <KazakhOrnament name="medallion" className="h-7 w-7 text-accent" />
        <KazakhOrnament name="camelNeck" className="h-5 w-5 text-accent/80" />
        <span className="h-px w-16 bg-[linear-gradient(90deg,var(--gold-2),transparent)]" />
      </div>
    </div>
  );
}

function Types() {
  const t = useTranslations("Types");
  const types = TOI_TYPES.filter((type) => type !== "other").map((type) => ({
    emoji: TOI_TYPE_META[type].emoji,
    label: t(TOI_TYPE_META[type].labelKey),
  }));
  return (
    <section className="relative overflow-hidden border-y border-accent/20 bg-muted/40 py-14">
      {/* Crisp gold ою ribbons frame the band section top and bottom. */}
      <OrnamentRibbon className="absolute inset-x-0 top-0 h-8 opacity-45" />
      <OrnamentRibbon className="absolute inset-x-0 bottom-0 h-8 opacity-45" />
      {/* Large medallions framing the chips and filling the side margins. */}
      <KazakhOrnament
        name="medallion"
        className="ornament-layer -left-28 top-1/2 hidden h-80 w-80 -translate-y-1/2 text-accent/10 lg:block"
      />
      <KazakhOrnament
        name="medallion"
        className="ornament-layer -right-28 top-1/2 hidden h-80 w-80 -translate-y-1/2 text-accent/10 lg:block"
      />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
        <SectionHeading subtitle={t("subtitle")}>{t("title")}</SectionHeading>
        <div className="flex flex-wrap justify-center gap-3">
          {types.map(({ emoji, label }) => (
            <span
              key={label}
              data-pop
              className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-premium transition-colors hover:border-accent/55"
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
    <section className="relative overflow-hidden px-4 py-14 sm:px-6">
      {/* Centre medallion redraws its gold linework as the section scrolls in. */}
      <DrawableOrnament
        name="medallion"
        strokeWidth={1.5}
        className="ornament-layer left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-accent/20"
      />
      <KazakhOrnament
        name="leaf"
        className="ornament-layer -left-20 top-10 hidden h-40 w-auto text-accent/10 lg:block"
      />
      <KazakhOrnament
        name="leaf"
        className="ornament-layer -right-20 bottom-10 hidden h-40 w-auto -scale-x-100 text-accent/10 lg:block"
      />
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <SectionHeading>{t("title")}</SectionHeading>
        <div className="relative mt-2">
          {/* Gold connector line linking the three step coins (sm+). */}
          <div
            aria-hidden
            data-connector
            className="absolute left-[16.6%] right-[16.6%] top-6 hidden h-px bg-[linear-gradient(90deg,transparent,var(--gold-2)_12%,var(--gold-2)_88%,transparent)] sm:block"
          />
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex flex-col items-center text-center">
                <div data-pop className="relative z-10 mb-4 grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(180deg,var(--gold-1),var(--accent)_55%,var(--gold-3))] font-display text-xl font-bold text-accent-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),inset_0_-3px_6px_-2px_rgba(120,80,10,0.4),0_8px_18px_-8px_rgba(151,111,28,0.5)] ring-1 ring-inset ring-white/30">
                  {n}
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">
                  {title}
                </h3>
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const t = useTranslations("Pricing");
  const includes = [t("inc1"), t("inc2"), t("inc3"), t("inc4"), t("inc5")];
  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-accent/20 bg-paper py-14"
    >
      <OrnamentRibbon className="absolute inset-x-0 top-0 h-8 opacity-45" />
      {/* Symmetric tree-of-life watermarks frame the price card. */}
      <KazakhOrnament
        name="treeOfLife"
        className="ornament-layer -left-28 top-1/2 hidden h-[120%] w-auto -translate-y-1/2 text-secondary/[0.06] lg:block"
      />
      <KazakhOrnament
        name="treeOfLife"
        className="ornament-layer -right-28 top-1/2 hidden h-[120%] w-auto -translate-y-1/2 scale-x-[-1] text-secondary/[0.06] lg:block"
      />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <SectionHeading subtitle={t("subtitle")}>{t("title")}</SectionHeading>

        <div
          data-card
          className="card-premium mx-auto max-w-md overflow-hidden rounded-2xl p-8"
        >
          <KazakhOrnament
            name="medallion"
            className="ornament-layer left-1/2 top-10 h-72 w-72 -translate-x-1/2 text-accent/[0.08]"
          />
          <OrnamentCorner className="absolute left-3 top-3 z-10" />
          <OrnamentCorner className="absolute right-3 top-3 z-10 rotate-90" />
          <OrnamentCorner className="absolute bottom-3 right-3 z-10 rotate-180" />
          <OrnamentCorner className="absolute bottom-3 left-3 z-10 -rotate-90" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground ring-1 ring-inset ring-accent/30">
              {t("launchLabel")}
            </span>
            <div className="mt-5 flex items-end justify-center gap-3">
              <span className="font-display text-5xl font-extrabold text-gold">
                {formatPrice(LAUNCH_PRICE)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="line-through">{formatPrice(MARKET_PRICE)}</span>{" "}
              <span className="text-muted-foreground/80">
                {t("marketLabel")}
              </span>
            </p>

            <div className="gold-rule mx-auto mt-6 w-3/4" />

            <ul className="mt-6 space-y-3 text-left">
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
      </div>
    </section>
  );
}
