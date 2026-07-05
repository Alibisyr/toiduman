"use client";

import { useRef, type CSSProperties, type ComponentType, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll } from "framer-motion";
import {
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Users,
  HeartHandshake,
  Sparkles as SparklesIcon,
  UtensilsCrossed,
  Wine,
  Music2,
  Gift,
  Camera,
} from "lucide-react";
import {
  inferProgramKind,
  type ProgramItem,
  type ProgramKind,
  type ToiData,
} from "@/lib/toi-schema";
import { type TemplateTheme, DEFAULT_THEME } from "@/lib/invite-themes";
import { monthName } from "@/lib/format-date";
import { buildMonthMatrix, WEEKDAYS_SHORT } from "@/lib/calendar";
import { OrnamentDivider } from "@/components/site/ornament";
import {
  TemplateSeal,
  FloralRosette,
  FloralDivider,
  LineDivider,
  DeckleEdge,
  KoshkarCorner,
  HEART_PATH,
} from "./ornaments";
import {
  InviteMotionProvider,
  Reveal,
  Letters,
  KenBurns,
  Parallax,
  Drift,
  Sparkles,
  DrawPath,
  useInviteMotion,
} from "./motion";
import { Countdown } from "./countdown";
import { MusicToggle, Rsvp, WishWall } from "./invite-interactive";
import { cn } from "@/lib/utils";

/** Lucide icon for each program kind (reception, marriage, betashar, dinner…). */
const PROGRAM_ICONS: Record<ProgramKind, ComponentType<{ className?: string }>> =
  {
    welcome: Users,
    ceremony: HeartHandshake,
    betashar: SparklesIcon,
    banquet: UtensilsCrossed,
    toast: Wine,
    dance: Music2,
    gift: Gift,
    photo: Camera,
    other: Clock,
  };

function programIcon(item: ProgramItem): ComponentType<{ className?: string }> {
  return PROGRAM_ICONS[item.kind ?? inferProgramKind(item.title)];
}

/**
 * Theme-driven invitation renderer. One `ToiData` → any of the templates in
 * `lib/invite-themes`. The theme sets scoped CSS variables on the root and
 * art-directs the photo/typography/ornament structure; the section bodies are
 * shared and coloured through the `.tpl-*` classes. All storytelling runs on
 * framer-motion via the primitives in `./motion`.
 */
export function InviteTemplate({
  data,
  locale,
  theme = DEFAULT_THEME,
  animate = true,
}: {
  data: ToiData;
  locale: string;
  theme?: TemplateTheme;
  /**
   * Run the opening/scroll story + ambient motion. Default on for the
   * full-screen invite; pass `false` for static contexts (gallery thumbnails,
   * the wizard editor) where the choreography would be noise.
   */
  animate?: boolean;
}) {
  const t = useTranslations("Invite");
  const d = data.eventAt ? new Date(data.eventAt) : null;
  const date = d && !Number.isNaN(d.getTime()) ? d : null;
  const names = data.hostNames.filter(Boolean);

  const rootStyle: CSSProperties = {
    ...theme.cssVars,
    background: "var(--tp)",
    borderRadius: theme.radius,
  };

  return (
    <InviteMotionProvider active={animate}>
      <article
        data-invite-root=""
        className="tpl relative mx-auto w-full max-w-[27rem] overflow-hidden shadow-2xl"
        style={rootStyle}
      >
        <Hero theme={theme} data={data} names={names} date={date} locale={locale} />

        {/* Invitation */}
        <Section>
          <div className="text-center">
            <Reveal>
              <Seal theme={theme} className="mx-auto" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="tpl-eyebrow mt-7 font-serif text-xs font-semibold tracking-[0.35em]">
                {t("invited")}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="tpl-ink mx-auto mt-5 max-w-[19rem] text-balance font-serif text-[1.15rem] italic leading-8">
                {data.customMessage || t("inviteDefault")}
              </p>
            </Reveal>
          </div>
        </Section>

        {/* Date + calendar + countdown */}
        {date ? (
          <Section alt>
            <Reveal>
              <Divider theme={theme} className="mb-7" />
              <div className="flex items-baseline justify-center gap-3 font-serif">
                <span className="tpl-ink text-2xl font-semibold uppercase tracking-[0.22em]">
                  {monthName(locale, date.getMonth())}
                </span>
                <span className="tpl-gold text-2xl font-medium tracking-[0.12em]">
                  {date.getFullYear()}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <table className="mx-auto mt-6 w-full max-w-xs border-separate border-spacing-y-2 text-center font-serif text-[0.95rem]">
                <thead>
                  <tr className="tpl-soft text-[0.7rem] uppercase tracking-[0.18em]">
                    {(WEEKDAYS_SHORT[locale] ?? WEEKDAYS_SHORT.ru).map((w) => (
                      <th key={w} className="pb-1 font-medium">
                        {w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buildMonthMatrix(date.getFullYear(), date.getMonth()).map(
                    (week, wi) => (
                      <tr key={wi}>
                        {week.map((day, di) => (
                          <td key={di} className="py-0.5">
                            {day ? (
                              day === date.getDate() ? (
                                <span className="relative mx-auto grid h-9 w-9 place-items-center">
                                  <svg
                                    viewBox="0 0 40 40"
                                    className="absolute -inset-1.5 h-12 w-12"
                                    aria-hidden
                                  >
                                    <DrawPath
                                      d={HEART_PATH}
                                      stroke={heartColor(theme)}
                                      strokeWidth={2.6}
                                      duration={1.6}
                                      delay={0.4}
                                    />
                                  </svg>
                                  <span
                                    className="text-lg font-bold"
                                    style={{ color: heartColor(theme) }}
                                  >
                                    {day}
                                  </span>
                                </span>
                              ) : (
                                <span className="tpl-ink opacity-75">{day}</span>
                              )
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                className="tpl-card mx-auto mt-7 flex max-w-xs items-center justify-between px-6 py-3.5"
                style={{
                  borderRadius: theme.radius,
                  borderLeft: `3px solid ${heartColor(theme)}`,
                }}
              >
                <span className="tpl-soft font-serif text-xs font-semibold uppercase tracking-[0.22em]">
                  {t("starts")}
                </span>
                <span className="tpl-time font-serif text-3xl font-semibold tabular-nums">
                  {String(date.getHours()).padStart(2, "0")}:
                  {String(date.getMinutes()).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-2 text-center">
                <Countdown eventAt={data.eventAt} />
              </div>
            </Reveal>
          </Section>
        ) : null}

        {/* Venue — photo band with parallax when the theme has one */}
        {data.venueName ? (
          <VenueBand theme={theme} data={data} t={t} />
        ) : null}

        {/* Dress code — palette swatches */}
        {data.dressColors.length > 0 || data.dressCode ? (
          <Section>
            <div className="text-center">
              <Reveal>
                <p className="tpl-eyebrow font-serif text-xs font-semibold tracking-[0.35em]">
                  {t("dressCode")}
                </p>
              </Reveal>
              {data.dressColors.length > 0 ? (
                <>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
                    {data.dressColors.map((c, i) => (
                      <Swatch key={i} color={c} index={i} />
                    ))}
                  </div>
                  <Reveal delay={0.3}>
                    <p className="tpl-soft mt-5 text-xs uppercase tracking-[0.2em]">
                      {t("dressCodeNote")}
                    </p>
                  </Reveal>
                </>
              ) : null}
              {data.dressCode ? (
                <Reveal delay={0.15}>
                  <p className="tpl-ink mt-4 font-serif text-xl font-semibold">
                    {data.dressCode}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </Section>
        ) : null}

        {/* Program — timeline whose spine draws in as the guest scrolls */}
        {data.program.length > 0 ? (
          <ProgramTimeline theme={theme} program={data.program} t={t} />
        ) : null}

        {/* Gallery */}
        {data.gallery.length > 0 ? (
          <Section>
            <Reveal>
              <h2 className="tpl-eyebrow mb-6 text-center font-serif text-xs font-semibold tracking-[0.35em]">
                {t("gallery")}
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-2.5">
              {data.gallery.map((src, i) => (
                <Reveal
                  key={i}
                  delay={(i % 4) * 0.08}
                  className={i % 3 === 0 ? "col-span-2" : ""}
                >
                  <div
                    className="overflow-hidden"
                    style={{ borderRadius: theme.radius }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className={cn(
                        "w-full object-cover transition-transform duration-700 hover:scale-105",
                        i % 3 === 0 ? "aspect-[2/1]" : "aspect-square",
                      )}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Hosts (primary accent panel) */}
        {names.length > 0 ? (
          <div className="px-6 py-10">
            <Reveal>
              <div
                className="tpl-primary overflow-hidden text-center"
                style={{ borderRadius: theme.radius }}
              >
                {theme.ornament === "nomad" ? (
                  <div className="lace-strip" />
                ) : (
                  <div className="pt-7" />
                )}
                <div className="px-8 py-7">
                  {theme.ornament !== "nomad" ? (
                    <div
                      className="mx-auto mb-5 h-px w-16"
                      style={{ background: "var(--g1)", opacity: 0.5 }}
                    />
                  ) : null}
                  <p
                    className="font-serif text-[0.7rem] font-semibold uppercase tracking-[0.4em]"
                    style={{ color: "var(--g1)" }}
                  >
                    {t("hosts")}
                  </p>
                  <p className="tpl-onp mt-4 font-serif text-[1.65rem] font-semibold leading-snug">
                    {names.join(" · ")}
                  </p>
                  {data.contacts.length > 0 ? (
                    <ul className="tpl-onp-soft mt-6 space-y-2 text-sm">
                      {data.contacts.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-center gap-2"
                        >
                          <Phone
                            className="h-3.5 w-3.5"
                            style={{ color: "var(--g1)" }}
                          />
                          <span className="font-medium">{c.name}</span>
                          <a href={`tel:${c.phone}`} className="hover:underline">
                            {c.phone}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {theme.ornament === "nomad" ? (
                  <div className="lace-strip rotate-180" />
                ) : (
                  <div className="pb-7" />
                )}
              </div>
            </Reveal>
          </div>
        ) : null}

        {/* RSVP */}
        <Section alt>
          <Reveal>
            <h2 className="tpl-ink text-center font-serif text-xl font-semibold leading-snug">
              {t("rsvpTitle")}
            </h2>
            <Divider theme={theme} className="my-6" />
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mx-auto max-w-xs text-left">
              <Rsvp />
            </div>
          </Reveal>
        </Section>

        {/* Wishes */}
        <Section>
          <Reveal>
            <h2 className="tpl-eyebrow text-center font-serif text-xs font-semibold tracking-[0.35em]">
              {t("wishes")}
            </h2>
            <Divider theme={theme} className="my-6" />
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mx-auto max-w-xs">
              <WishWall />
            </div>
          </Reveal>
        </Section>

        {/* Ending */}
        <Ending theme={theme} names={names} t={t} />
      </article>
    </InviteMotionProvider>
  );
}

/** Accent used for the drawn heart + time chip: rose themes use the rose. */
function heartColor(theme: TemplateTheme): string {
  return theme.ornament === "floral" ? "var(--tpr)" : "var(--tac)";
}

/* ── building blocks ───────────────────────────────────────────── */

function Section({
  alt,
  className,
  children,
}: {
  alt?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(alt ? "tpl-alt" : "tpl-paper", "px-8 py-11", className)}
    >
      {children}
    </section>
  );
}

function Divider({
  theme,
  className,
}: {
  theme: TemplateTheme;
  className?: string;
}) {
  switch (theme.ornament) {
    case "floral":
      return <FloralDivider className={cn("tpl-gold", className)} />;
    case "line":
      return <LineDivider className={cn("tpl-gold", className)} />;
    case "none":
      return (
        <div
          className={cn("mx-auto h-px w-12", className)}
          style={{ background: "var(--tac)" }}
          aria-hidden
        />
      );
    default:
      return <OrnamentDivider className={cn("text-[var(--g2)]", className)} />;
  }
}

function Seal({
  theme,
  className,
}: {
  theme: TemplateTheme;
  className?: string;
}) {
  switch (theme.ornament) {
    case "floral":
      return <FloralRosette className={className} />;
    case "line":
      return (
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            className,
          )}
          style={{ border: "1px solid var(--g2)" }}
          aria-hidden
        >
          <span
            className="h-2 w-2 rotate-45"
            style={{ background: "var(--g2)" }}
          />
        </div>
      );
    case "none":
      return null;
    default:
      return <TemplateSeal className={className} />;
  }
}

/** One dress-code swatch, popping in with a small spring. */
function Swatch({ color, index }: { color: string; index: number }) {
  const active = useInviteMotion();
  const ring: CSSProperties = {
    boxShadow:
      "0 0 0 1px var(--g2), 0 0 0 4px var(--tp), 0 6px 14px -8px rgba(0,0,0,0.5)",
  };
  const dot = (
    <span
      className="grid h-11 w-11 place-items-center rounded-full"
      style={ring}
      title={color}
    >
      <span className="h-9 w-9 rounded-full" style={{ background: color }} />
    </span>
  );
  if (!active) return dot;
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
        delay: index * 0.08,
      }}
      whileHover={{ scale: 1.12 }}
      className="inline-block"
    >
      {dot}
    </motion.span>
  );
}

/* ── sections with their own choreography ──────────────────────── */

function VenueBand({
  theme,
  data,
  t,
}: {
  theme: TemplateTheme;
  data: ToiData;
  t: ReturnType<typeof useTranslations<"Invite">>;
}) {
  const photo = theme.art.band;
  const heading =
    theme.nameStyle === "script" ? (
      <span
        className="font-script text-[2.6rem] leading-none"
        style={{ color: "var(--g1)" }}
      >
        {t("address")}
      </span>
    ) : (
      <span className="tpl-eyebrow font-serif text-xs font-semibold tracking-[0.35em]">
        {t("address")}
      </span>
    );

  const body = (
    <>
      <Reveal>{heading}</Reveal>
      <Reveal delay={0.15}>
        <MapPin
          className="mx-auto mt-6 h-6 w-6"
          style={{ color: photo ? "var(--g1)" : "var(--g2)" }}
        />
        <p
          className="mt-3 font-serif text-2xl font-semibold"
          style={{ color: photo ? "#fff" : "var(--ti)" }}
        >
          {data.venueName}
        </p>
        {data.address ? (
          <p
            className="mt-2 text-sm"
            style={{
              color: photo
                ? "rgba(255,255,255,0.72)"
                : "var(--ts)",
            }}
          >
            {data.address}
          </p>
        ) : null}
      </Reveal>
      {data.mapUrl ? (
        <Reveal delay={0.28}>
          <a
            href={data.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tpl-btn mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={
              photo
                ? {
                    background: "color-mix(in srgb, var(--g2) 88%, #fff)",
                    color: "#241505",
                    boxShadow: "0 10px 24px -10px rgba(0,0,0,0.6)",
                  }
                : undefined
            }
          >
            {t("openMap")}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Reveal>
      ) : null}
    </>
  );

  if (!photo) {
    return (
      <Section>
        <div className="text-center">
          <div
            className="tpl-card mx-auto max-w-xs px-6 py-8"
            style={{ borderRadius: theme.radius }}
          >
            {body}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden px-8 py-16 text-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Parallax range={46} className="absolute -inset-y-16 inset-x-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: theme.art.filter }}
          />
        </Parallax>
        <div className="absolute inset-0" style={{ background: theme.art.overlay }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 70% at 50% 50%, rgba(10,8,6,0.34), transparent 75%)",
          }}
        />
      </div>
      <Drift
        className="pointer-events-none absolute -right-14 -top-14"
        duration={11}
        rotate={-3}
      >
        <KoshkarCorner className="h-56 w-56 rotate-90 text-white/30 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.35))]" />
      </Drift>
      {body}
      {theme.edge === "torn" ? (
        <>
          <DeckleEdge
            flip
            className="absolute inset-x-0 top-0 h-8 text-[var(--tp2)]"
          />
          <DeckleEdge className="absolute inset-x-0 bottom-0 h-8 text-[var(--tp)]" />
        </>
      ) : null}
    </section>
  );
}

function ProgramTimeline({
  theme,
  program,
  t,
}: {
  theme: TemplateTheme;
  program: ProgramItem[];
  t: ReturnType<typeof useTranslations<"Invite">>;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const active = useInviteMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 78%", "end 62%"],
  });

  return (
    <Section alt>
      <Reveal>
        <h2 className="tpl-eyebrow text-center font-serif text-xs font-semibold tracking-[0.35em]">
          {t("program")}
        </h2>
        <Divider theme={theme} className="my-6" />
      </Reveal>
      <ul ref={listRef} className="relative mx-auto max-w-xs space-y-7 pl-1">
        {/* timeline spine — draws downward with scroll */}
        <span
          className="absolute bottom-2 left-[21px] top-2 w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--tl) 12%, var(--tl) 88%, transparent)",
          }}
          aria-hidden
        />
        <motion.span
          className="absolute bottom-2 left-[21px] top-2 w-px origin-top"
          style={{
            scaleY: active ? scrollYProgress : 1,
            background:
              "linear-gradient(180deg, var(--g1), var(--g2) 55%, var(--g3))",
          }}
          aria-hidden
        />
        {program.map((item, i) => {
          const Icon = programIcon(item);
          return (
            <Reveal key={i} delay={i * 0.05} y={22}>
              <li className="flex items-center gap-4">
                <span
                  className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full"
                  style={{
                    background: "var(--tp)",
                    boxShadow:
                      "0 0 0 1px color-mix(in srgb, var(--g2) 55%, transparent), 0 6px 14px -8px rgba(0,0,0,0.35)",
                  }}
                >
                  <Icon className="tpl-gold h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="tpl-ink block font-serif text-[1.05rem] font-semibold leading-snug">
                    {item.title}
                  </span>
                  {item.description ? (
                    <span className="tpl-soft block text-xs leading-snug">
                      {item.description}
                    </span>
                  ) : null}
                </span>
                {item.time ? (
                  <span className="tpl-time shrink-0 font-serif text-lg font-semibold tabular-nums">
                    {item.time}
                  </span>
                ) : null}
              </li>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

function Ending({
  theme,
  names,
  t,
}: {
  theme: TemplateTheme;
  names: string[];
  t: ReturnType<typeof useTranslations<"Invite">>;
}) {
  const photo = theme.art.footer ?? theme.art.hero;

  return (
    <footer className="relative isolate overflow-hidden px-8 pb-14 pt-16 text-center">
      {photo ? (
        <>
          <div className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover object-bottom"
              style={{ filter: theme.art.filter }}
            />
            <div
              className="absolute inset-0"
              style={{ background: theme.art.overlay }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 100% 80% at 50% 62%, rgba(10,8,6,0.38), transparent 78%)",
              }}
            />
          </div>
          <Sparkles count={14} seed={11} />
        </>
      ) : (
        <div
          className="absolute inset-0 -z-10 tpl-primary"
          style={{
            backgroundImage: "url(/ornament-watermark.svg)",
            backgroundSize: "200px 200px",
          }}
        />
      )}
      {theme.edge === "torn" ? (
        <DeckleEdge
          flip
          className="absolute inset-x-0 top-0 h-8 text-[var(--tp)]"
        />
      ) : null}
      {theme.edge === "lace" ? (
        <div className="lace-strip absolute inset-x-0 top-0" />
      ) : null}
      <Reveal>
        <Seal theme={theme} className="mx-auto h-16 w-16" />
      </Reveal>
      <Reveal delay={0.15}>
        {theme.nameStyle === "script" ? (
          <p
            className="mt-7 font-script text-4xl leading-tight"
            style={{ color: "var(--g1)" }}
          >
            {t("ending")}
          </p>
        ) : (
          <p
            className="mt-7 font-serif text-2xl font-semibold"
            // On a photo the gold ramp can go muddy — plain warm white reads better.
            style={{ color: photo ? "#fdfaf4" : "var(--g2)" }}
          >
            {t("ending")}
          </p>
        )}
        {names.length > 0 ? (
          <p className="tpl-onp-soft mt-3 font-serif text-base tracking-wide">
            {names.join(" · ")}
          </p>
        ) : null}
      </Reveal>
    </footer>
  );
}

/* ── hero ──────────────────────────────────────────────────────── */

function Hero({
  theme,
  data,
  names,
  date,
  locale,
}: {
  theme: TemplateTheme;
  data: ToiData;
  names: string[];
  date: Date | null;
  locale: string;
}) {
  const dateLine = date
    ? `${date.getDate()} ${monthName(locale, date.getMonth())} ${date.getFullYear()}`
    : "";
  const photo = data.coverPhotoUrl || theme.art.hero;

  /* Typography-only hero (altyn): ivory paper, gold foil, double hairline frame. */
  if (!photo) {
    return (
      <header className="tpl-paper relative overflow-hidden px-8 py-20 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% -10%, color-mix(in srgb, var(--g1) 32%, transparent), transparent 55%)",
          }}
        />
        <Sparkles count={10} seed={3} color="var(--g2)" />
        <div
          className="relative mx-auto max-w-[19.5rem] px-7 py-14"
          style={{
            border: "1px solid var(--g2)",
            boxShadow:
              "inset 0 0 0 4px var(--tp), inset 0 0 0 5px color-mix(in srgb, var(--g2) 45%, transparent)",
          }}
        >
          <Reveal y={16}>
            <p className="tpl-gold font-serif text-[0.7rem] font-semibold uppercase tracking-[0.5em]">
              {data.title}
            </p>
          </Reveal>
          <h1 className="tpl-ink mt-7 font-serif text-[2.6rem] font-medium leading-tight tracking-wide">
            {names.length > 0
              ? names.map((n, i) => (
                  <span key={i} className="block">
                    {i > 0 ? (
                      <span className="tpl-gold block font-script text-3xl leading-relaxed">
                        &amp;
                      </span>
                    ) : null}
                    <Letters text={n} delay={0.3 + i * 0.5} stagger={0.05} />
                  </span>
                ))
              : "—"}
          </h1>
          <Reveal delay={0.5} y={12}>
            <LineDivider className="tpl-gold my-7" />
            {date ? (
              <p className="tpl-soft font-serif text-sm uppercase tracking-[0.3em]">
                {dateLine}
              </p>
            ) : null}
          </Reveal>
          {data.musicUrl ? (
            <Reveal delay={0.7} y={10}>
              <div className="mt-8 flex justify-center">
                <MusicToggle src={data.musicUrl} />
              </div>
            </Reveal>
          ) : null}
        </div>
      </header>
    );
  }

  /* Editorial caps hero (modern): duotone photo, huge grotesque, hot accent. */
  if (theme.nameStyle === "caps") {
    return (
      <header className="relative isolate flex min-h-[36rem] flex-col justify-end overflow-hidden px-8 pb-16 pt-14 text-left">
        <KenBurns src={photo} filter={theme.art.filter} className="-z-20" />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: theme.art.overlay }}
        />
        <Reveal y={18}>
          <p
            className="font-display text-xs font-bold uppercase tracking-[0.35em]"
            style={{ color: "var(--tac)" }}
          >
            {data.title}
          </p>
        </Reveal>
        <div className="mt-6 flex items-stretch gap-4">
          <motion.span
            className="w-1 shrink-0 origin-top rounded-full"
            style={{ background: "var(--tac)" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
          <h1 className="font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white">
            {names.length > 0
              ? names.map((n, i) => (
                  <span key={i} className="block">
                    <Letters text={n} delay={0.35 + i * 0.4} stagger={0.035} />
                  </span>
                ))
              : "—"}
          </h1>
        </div>
        {date ? (
          <Reveal delay={0.9} y={14}>
            <p className="mt-8 text-sm uppercase tracking-[0.22em] text-white/70">
              {dateLine}
              {data.venueName ? ` · ${data.venueName}` : ""}
            </p>
          </Reveal>
        ) : null}
        {data.musicUrl ? (
          <Reveal delay={1.05} y={10}>
            <div className="mt-7">
              <MusicToggle src={data.musicUrl} />
            </div>
          </Reveal>
        ) : null}
      </header>
    );
  }

  /* Signature photo hero: ken-burns landscape, drifting corner ою, script names. */
  return (
    <header className="relative isolate flex min-h-[38rem] flex-col items-center justify-center overflow-hidden px-7 pb-20 pt-16 text-center">
      <KenBurns src={photo} filter={theme.art.filter} className="-z-20" />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: theme.art.overlay }}
      />
      {/* localized backdrop behind the names so they stay legible on bright photos */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 95% 52% at 50% 44%, rgba(10,8,6,0.36), transparent 72%)",
        }}
      />
      <Drift
        className="pointer-events-none absolute -left-12 -top-12"
        duration={10}
      >
        <KoshkarCorner className="h-64 w-64 text-white/45 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.35))]" />
      </Drift>
      <Drift
        className="pointer-events-none absolute -bottom-12 -right-12"
        duration={12}
        delay={1.2}
        rotate={-2}
      >
        <KoshkarCorner className="h-64 w-64 rotate-180 text-white/35 [filter:drop-shadow(0_1px_8px_rgba(0,0,0,0.35))]" />
      </Drift>
      <Sparkles count={16} seed={5} />

      <Reveal y={16}>
        <p
          className="font-serif text-[0.72rem] font-semibold uppercase tracking-[0.45em]"
          style={{ color: "var(--g1)" }}
        >
          {data.title}
        </p>
      </Reveal>
      <Reveal delay={0.2} y={12}>
        <Divider theme={theme} className="my-6 opacity-90" />
      </Reveal>

      <h1 className="font-script text-[3.4rem] leading-[1.15] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45),0_6px_32px_rgba(0,0,0,0.5)]">
        {names.length > 0
          ? names.map((n, i) => (
              <span key={i} className="block">
                {i > 0 ? (
                  <span
                    className="block font-script text-[2.1rem] leading-none"
                    style={{ color: "var(--g1)" }}
                  >
                    &amp;
                  </span>
                ) : null}
                <Letters text={n} delay={0.45 + i * 0.55} stagger={0.06} />
              </span>
            ))
          : "—"}
      </h1>

      {date ? (
        <Reveal delay={1.1} y={14}>
          <p
            className="mt-8 font-serif text-sm font-medium uppercase tracking-[0.3em]"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {dateLine}
          </p>
        </Reveal>
      ) : null}
      {data.musicUrl ? (
        <Reveal delay={1.3} y={10}>
          <div className="mt-8">
            <MusicToggle src={data.musicUrl} />
          </div>
        </Reveal>
      ) : null}

      {theme.edge === "torn" ? (
        <DeckleEdge className="absolute inset-x-0 bottom-0 h-9 text-[var(--tp)]" />
      ) : null}
      {theme.edge === "lace" ? (
        <div className="absolute inset-x-0 bottom-0">
          <div className="lace-strip" />
        </div>
      ) : null}
    </header>
  );
}
