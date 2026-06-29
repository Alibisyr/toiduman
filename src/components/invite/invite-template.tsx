import { useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import type { ToiData } from "@/lib/toi-schema";
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
} from "./ornaments";
import { Countdown } from "./countdown";
import { Rsvp, WishWall } from "./invite-interactive";
import { cn } from "@/lib/utils";

/**
 * Theme-driven invitation renderer. One `ToiData` → any of the templates in
 * `lib/invite-themes`. The theme sets scoped CSS variables on the root and
 * switches the hero / ornament / surface structure; the section bodies are
 * shared and coloured through the `.tpl-*` classes.
 */
export function InviteTemplate({
  data,
  locale,
  theme = DEFAULT_THEME,
}: {
  data: ToiData;
  locale: string;
  theme?: TemplateTheme;
}) {
  const t = useTranslations("Invite");
  const d = data.eventAt ? new Date(data.eventAt) : null;
  const date = d && !Number.isNaN(d.getTime()) ? d : null;
  const names = data.hostNames.filter(Boolean);
  const nomad = theme.ornament === "nomad";

  const rootStyle: CSSProperties = {
    ...theme.cssVars,
    background: theme.surface === "card" ? "var(--tp2)" : "var(--tp)",
    borderRadius: theme.radius,
  };

  return (
    <article
      className="tpl mx-auto w-full max-w-[27rem] overflow-hidden shadow-xl"
      style={rootStyle}
    >
      <Hero theme={theme} data={data} names={names} date={date} locale={locale} />

      {/* Invitation */}
      <Section theme={theme}>
        <div className="text-center">
          <Seal theme={theme} className="mx-auto" />
          <p className="tpl-eyebrow mt-6 font-display text-xs font-semibold tracking-[0.3em]">
            {t("invited")}
          </p>
          <p className="tpl-soft mx-auto mt-4 max-w-xs text-balance text-[0.95rem] leading-7">
            {data.customMessage || t("inviteDefault")}
          </p>
          {data.dressCode ? (
            <p className="tpl-chip-gold mt-5 inline-flex rounded-full px-4 py-1.5 text-xs font-medium">
              {t("dressCode")}: {data.dressCode}
            </p>
          ) : null}
        </div>
      </Section>

      {/* Date + calendar + countdown */}
      {date ? (
        <Section theme={theme} alt>
          <Divider theme={theme} className="mb-6" />
          <div className="flex items-baseline justify-center gap-3 font-display">
            <span className="tpl-ink text-lg font-bold uppercase tracking-widest">
              {monthName(locale, date.getMonth())}
            </span>
            <span className="tpl-gold text-lg font-semibold">
              {date.getFullYear()}
            </span>
          </div>

          <table className="mx-auto mt-5 w-full max-w-xs border-separate border-spacing-y-1 text-center text-sm">
            <thead>
              <tr className="tpl-soft text-[0.7rem] uppercase tracking-wide">
                {(WEEKDAYS_SHORT[locale] ?? WEEKDAYS_SHORT.ru).map((w) => (
                  <th key={w} className="font-medium">
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
                            <span className="tpl-day mx-auto grid h-8 w-8 place-items-center rounded-full font-bold shadow">
                              {day}
                            </span>
                          ) : (
                            <span className="tpl-ink opacity-80">{day}</span>
                          )
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ),
              )}
            </tbody>
          </table>

          <div
            className="tpl-card mx-auto mt-6 flex max-w-xs items-center justify-between rounded-xl px-5 py-3"
            style={{ borderLeft: "4px solid var(--tac)" }}
          >
            <span className="tpl-soft text-xs font-semibold uppercase tracking-wide">
              {t("starts")}
            </span>
            <span className="tpl-time font-display text-2xl font-bold">
              {String(date.getHours()).padStart(2, "0")}:
              {String(date.getMinutes()).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-2 text-center">
            <Countdown eventAt={data.eventAt} />
          </div>
        </Section>
      ) : null}

      {/* Venue */}
      {data.venueName ? (
        <Section theme={theme}>
          <div className="text-center">
            <p className="tpl-eyebrow font-display text-xs font-semibold tracking-[0.3em]">
              {t("address")}
            </p>
            <div
              className="tpl-card mx-auto mt-5 max-w-xs px-6 py-7"
              style={{ borderRadius: theme.radius }}
            >
              <MapPin className="tpl-accent mx-auto h-6 w-6" />
              <p className="tpl-ink mt-3 font-display text-xl font-bold">
                {data.venueName}
              </p>
              {data.address ? (
                <p className="tpl-soft mt-1 text-sm">{data.address}</p>
              ) : null}
              {data.mapUrl ? (
                <a
                  href={data.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tpl-btn mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-px"
                >
                  {t("openMap")}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      {/* Program */}
      {data.program.length > 0 ? (
        <Section theme={theme} alt>
          <h2 className="tpl-eyebrow text-center font-display text-xs font-semibold tracking-[0.3em]">
            {t("program")}
          </h2>
          <Divider theme={theme} className="my-5" />
          <ul className="mx-auto max-w-xs space-y-4">
            {data.program.map((item, i) => (
              <li key={i} className="flex gap-4 text-sm">
                <span className="tpl-time flex w-14 shrink-0 items-center gap-1 font-display font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  {item.time || "—"}
                </span>
                <span>
                  <span className="tpl-ink font-medium">{item.title}</span>
                  {item.description ? (
                    <span className="tpl-soft block">{item.description}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Gallery */}
      {data.gallery.length > 0 ? (
        <Section theme={theme}>
          <h2 className="tpl-eyebrow mb-5 text-center font-display text-xs font-semibold tracking-[0.3em]">
            {t("gallery")}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {data.gallery.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        </Section>
      ) : null}

      {/* Hosts (primary accent panel) */}
      {names.length > 0 ? (
        <div className={theme.surface === "card" ? "px-5 py-3" : "px-6 py-10"}>
          <div
            className="tpl-primary overflow-hidden text-center"
            style={{ borderRadius: theme.radius }}
          >
            {nomad ? <div className="lace-strip" /> : <div className="pt-7" />}
            <div className="px-8 py-7">
              {!nomad ? (
                <div
                  className="mx-auto mb-5 h-px w-16"
                  style={{ background: "var(--g1)", opacity: 0.5 }}
                />
              ) : null}
              <p
                className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.35em]"
                style={{ color: "var(--g1)" }}
              >
                {t("hosts")}
              </p>
              <p className="tpl-onp mt-4 font-display text-2xl font-bold">
                {names.join(" · ")}
              </p>
              {data.contacts.length > 0 ? (
                <ul className="tpl-onp-soft mt-6 space-y-2 text-sm">
                  {data.contacts.map((c, i) => (
                    <li key={i} className="flex items-center justify-center gap-2">
                      <Phone className="h-3.5 w-3.5" style={{ color: "var(--g1)" }} />
                      <span className="font-medium">{c.name}</span>
                      <a href={`tel:${c.phone}`} className="hover:underline">
                        {c.phone}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {nomad ? (
              <div className="lace-strip rotate-180" />
            ) : (
              <div className="pb-7" />
            )}
          </div>
        </div>
      ) : null}

      {/* RSVP */}
      <Section theme={theme} alt>
        <h2 className="tpl-ink text-center font-display text-base font-bold leading-snug">
          {t("rsvpTitle")}
        </h2>
        <Divider theme={theme} className="my-6" />
        <div className="mx-auto max-w-xs text-left">
          <Rsvp />
        </div>
      </Section>

      {/* Wishes */}
      <Section theme={theme}>
        <h2 className="tpl-eyebrow text-center font-display text-xs font-semibold tracking-[0.3em]">
          {t("wishes")}
        </h2>
        <Divider theme={theme} className="my-6" />
        <div className="mx-auto max-w-xs">
          <WishWall />
        </div>
      </Section>

      {/* Ending */}
      <footer className="tpl-primary relative isolate overflow-hidden px-8 pb-12 pt-14 text-center">
        {nomad ? (
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: "url(/ornament-watermark.svg)",
              backgroundSize: "200px 200px",
              opacity: 0.12,
            }}
          />
        ) : null}
        {theme.hero === "stage" ? (
          <DeckleEdge
            flip
            className="absolute inset-x-0 top-0 h-7 text-[var(--tp)]"
          />
        ) : null}
        <Seal theme={theme} className="mx-auto h-16 w-16" />
        <p className="tpl-gold mt-6 font-display text-xl font-bold">
          {t("ending")}
        </p>
        {names.length > 0 ? (
          <p className="tpl-onp-soft mt-2 text-sm tracking-wide">
            {names.join(" · ")}
          </p>
        ) : null}
      </footer>
    </article>
  );
}

/* ── building blocks ───────────────────────────────────────────── */

function Section({
  theme,
  alt,
  className,
  children,
}: {
  theme: TemplateTheme;
  alt?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (theme.surface === "card") {
    return (
      <div className="px-5 py-3">
        <div
          className="tpl-card overflow-hidden"
          style={{ borderRadius: theme.radius }}
        >
          <div className={cn("px-7 py-9", className)}>{children}</div>
        </div>
      </div>
    );
  }
  return (
    <section
      className={cn(
        theme.surface === "band" && alt ? "tpl-alt" : "tpl-paper",
        "px-8 py-10",
        className,
      )}
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

/* ── heroes ────────────────────────────────────────────────────── */

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

  if (theme.hero === "split") {
    return (
      <header className="tpl-paper relative px-8 pb-12 pt-16">
        <p className="tpl-accent font-display text-xs font-bold uppercase tracking-[0.3em]">
          {data.title}
        </p>
        <div className="mt-6 flex items-stretch gap-4">
          <span
            className="w-1 shrink-0 rounded-full"
            style={{ background: "var(--tac)" }}
          />
          <h1 className="tpl-ink font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight">
            {names.length > 0
              ? names.map((n, i) => (
                  <span key={i} className="block">
                    {n}
                  </span>
                ))
              : "—"}
          </h1>
        </div>
        {date ? (
          <p className="tpl-soft mt-8 text-sm uppercase tracking-wide">
            {dateLine}
            {data.venueName ? ` · ${data.venueName}` : ""}
          </p>
        ) : null}
      </header>
    );
  }

  if (theme.hero === "minimal") {
    return (
      <header className="tpl-paper relative px-8 py-20 text-center">
        <div
          className="mx-auto max-w-[19rem] px-6 py-12"
          style={{ border: "1px solid var(--g2)" }}
        >
          <p className="tpl-gold font-display text-[0.7rem] font-semibold uppercase tracking-[0.45em]">
            {data.title}
          </p>
          <h1 className="tpl-ink mt-6 font-display text-4xl font-semibold tracking-tight">
            {names.length > 0 ? names.join(" & ") : "—"}
          </h1>
          <div
            className="mx-auto my-6 h-px w-16"
            style={{ background: "var(--g2)" }}
          />
          {date ? (
            <p className="tpl-soft text-xs uppercase tracking-[0.3em]">
              {dateLine}
            </p>
          ) : null}
        </div>
      </header>
    );
  }

  if (theme.hero === "arch") {
    return (
      <header className="tpl-primary relative overflow-hidden px-8 pb-12 pt-14 text-center">
        <div
          className="mx-auto max-w-[15rem] bg-[var(--tp)] px-6 pb-8 pt-10"
          style={{ borderRadius: `9999px 9999px ${theme.radius} ${theme.radius}` }}
        >
          <p className="tpl-gold font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em]">
            {data.title}
          </p>
          <h1 className="tpl-ink mt-3 font-display text-3xl font-bold leading-tight">
            {names.length > 0 ? names.join(" & ") : "—"}
          </h1>
          <FloralDivider className="tpl-gold my-4" />
          {date ? (
            <p className="tpl-soft text-xs uppercase tracking-[0.2em]">
              {dateLine}
            </p>
          ) : null}
        </div>
      </header>
    );
  }

  if (theme.hero === "band") {
    return (
      <header className="tpl-primary relative overflow-hidden px-7 pb-0 pt-12 text-center">
        {data.coverPhotoUrl ? <CoverPhoto url={data.coverPhotoUrl} /> : null}
        <div
          className="relative mx-2 border-y-2 py-9"
          style={{ borderColor: "var(--g2)" }}
        >
          <p className="tpl-eyebrow font-display text-[0.7rem] font-semibold tracking-[0.35em]">
            {data.title}
          </p>
          <h1 className="tpl-gold mt-4 font-display text-4xl font-extrabold leading-tight">
            {names.length > 0
              ? names.map((n, i) => (
                  <span key={i} className="block">
                    {i > 0 ? (
                      <span className="tpl-onp-soft my-1 block text-xl font-medium">
                        &amp;
                      </span>
                    ) : null}
                    {n}
                  </span>
                ))
              : "—"}
          </h1>
          {date ? (
            <p className="tpl-onp-soft mt-4 text-xs uppercase tracking-[0.25em]">
              {dateLine}
            </p>
          ) : null}
        </div>
        <div className="lace-strip" />
      </header>
    );
  }

  // "stage" — full-bleed colour hero with deckle edge (dala / tun)
  return (
    <header className="tpl-primary relative isolate flex min-h-[26rem] flex-col items-center justify-center overflow-hidden px-8 py-16 text-center">
      {data.coverPhotoUrl ? (
        <CoverPhoto url={data.coverPhotoUrl} />
      ) : (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url(/ornament-watermark.svg)",
            backgroundSize: "200px 200px",
            opacity: 0.12,
          }}
        />
      )}
      <p className="tpl-eyebrow font-display text-[0.7rem] font-semibold tracking-[0.4em]">
        {data.title}
      </p>
      <Divider theme={theme} className="my-6" />
      <h1 className="tpl-gold font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        {names.length > 0
          ? names.map((n, i) => (
              <span key={i} className="block">
                {i > 0 ? (
                  <span className="tpl-onp-soft my-1 block text-2xl font-medium">
                    &amp;
                  </span>
                ) : null}
                {n}
              </span>
            ))
          : "—"}
      </h1>
      {date ? (
        <p className="tpl-onp-soft mt-7 text-sm uppercase tracking-[0.2em]">
          {dateLine}
        </p>
      ) : null}
      <DeckleEdge className="absolute inset-x-0 bottom-0 h-7 text-[var(--tp)]" />
    </header>
  );
}

function CoverPhoto({ url }: { url: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,10,0.45), rgba(20,16,10,0.82))",
        }}
      />
    </>
  );
}
