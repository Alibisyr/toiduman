import { useTranslations } from "next-intl";
import { MapPin, Clock, Phone, CalendarDays } from "lucide-react";
import type { ToiData } from "@/lib/toi-schema";
import { formatEventDateTime } from "@/lib/format-date";
import { OrnamentDivider, OrnamentCorner } from "@/components/site/ornament";
import { Countdown } from "./countdown";

/**
 * Renders a ToiData object as a styled invitation. Used by the wizard preview
 * step now, and a reference for the real templates added later. No client-only
 * features, so it can also be server-rendered on the public invite page.
 */
export function InvitePreview({
  data,
  locale,
}: {
  data: ToiData;
  locale: string;
}) {
  const t = useTranslations("Invite");

  return (
    <article className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
      {data.coverPhotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.coverPhotoUrl}
          alt=""
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="h-20 bg-paper" />
      )}

      <div className="relative px-8 pb-10 pt-8 text-center">
        <OrnamentCorner className="absolute left-3 top-3" />
        <OrnamentCorner className="absolute right-3 top-3 rotate-90" />
        <OrnamentCorner className="absolute bottom-3 right-3 rotate-180" />
        <OrnamentCorner className="absolute bottom-3 left-3 -rotate-90" />

        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
          {t("invited")}
        </p>
        <OrnamentDivider className="my-5" />

        {data.title ? (
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {data.title}
          </p>
        ) : null}

        <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground">
          {data.hostNames.length > 0
            ? data.hostNames.join(" & ")
            : "—"}
        </h2>

        {data.eventAt ? (
          <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            {formatEventDateTime(data.eventAt, locale)}
          </p>
        ) : null}

        {data.venueName ? (
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>
              {data.venueName}
              {data.address ? `, ${data.address}` : ""}
            </span>
          </p>
        ) : null}

        {data.mapUrl ? (
          <a
            href={data.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <MapPin className="h-3.5 w-3.5" />
            {t("openMap")}
          </a>
        ) : null}

        <Countdown eventAt={data.eventAt} />

        {data.dressCode ? (
          <p className="mt-4 text-sm">
            <span className="font-medium">{t("dressCode")}:</span>{" "}
            <span className="text-muted-foreground">{data.dressCode}</span>
          </p>
        ) : null}

        {data.customMessage ? (
          <p className="mx-auto mt-6 max-w-sm text-balance text-sm italic leading-6 text-muted-foreground">
            “{data.customMessage}”
          </p>
        ) : null}

        {data.program.length > 0 ? (
          <div className="mt-8 text-left">
            <OrnamentDivider className="mb-5" />
            <h3 className="mb-3 text-center font-display text-base font-semibold">
              {t("program")}
            </h3>
            <ul className="space-y-3">
              {data.program.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex w-14 shrink-0 items-center gap-1 font-medium text-primary">
                    <Clock className="h-3.5 w-3.5" />
                    {item.time || "—"}
                  </span>
                  <span>
                    <span className="font-medium">{item.title}</span>
                    {item.description ? (
                      <span className="block text-muted-foreground">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.gallery.length > 0 ? (
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-2">
              {data.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        ) : null}

        {data.contacts.length > 0 ? (
          <div className="mt-8">
            <OrnamentDivider className="mb-5" />
            <h3 className="mb-3 font-display text-base font-semibold">
              {t("contacts")}
            </h3>
            <ul className="space-y-1.5 text-sm">
              {data.contacts.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center justify-center gap-2 text-muted-foreground"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span>{c.phone}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
