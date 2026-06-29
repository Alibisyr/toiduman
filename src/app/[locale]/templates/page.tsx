import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { OrnamentDivider } from "@/components/site/ornament";
import { InviteTemplate } from "@/components/invite/invite-template";
import { getDemoToi } from "@/lib/demo-toi";
import { INVITE_THEMES, type TemplateTheme } from "@/lib/invite-themes";
import type { ToiData } from "@/lib/toi-schema";

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TemplatesContent locale={locale} />;
}

function TemplatesContent({ locale }: { locale: string }) {
  const t = useTranslations("Templates");
  const demo = getDemoToi(locale);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        <OrnamentDivider className="mt-8" />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {INVITE_THEMES.map((theme) => (
          <TemplateCard
            key={theme.id}
            theme={theme}
            desc={t(theme.descKey)}
            viewLabel={t("view")}
            locale={locale}
            demo={demo}
          />
        ))}
      </div>
    </section>
  );
}

/** A live, scaled-down render of the real template inside a card. */
function TemplateCard({
  theme,
  desc,
  viewLabel,
  locale,
  demo,
}: {
  theme: TemplateTheme;
  desc: string;
  viewLabel: string;
  locale: string;
  demo: ToiData;
}) {
  return (
    <div className="card-premium group relative flex flex-col overflow-hidden rounded-2xl">
      <div
        className="pointer-events-none relative h-[24rem] overflow-hidden"
        style={{ ...theme.cssVars, background: "var(--tb)" }}
      >
        <div className="mx-auto h-full w-[216px] overflow-hidden">
          <div className="w-[432px] origin-top-left scale-[0.5]">
            <InviteTemplate data={demo} locale={locale} theme={theme} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
      </div>

      <div className="px-5 pb-5 pt-4">
        <h2 className="font-display text-lg font-bold">{theme.name}</h2>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {desc}
        </p>
      </div>

      {/* Single interactive overlay → keeps markup valid (no nested links). */}
      <Link
        href={`/preview/${theme.id}`}
        aria-label={viewLabel}
        className="absolute inset-0 flex items-end justify-center"
      >
        <span className="mb-[6.5rem] translate-y-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground opacity-0 shadow-[0_8px_20px_-8px_rgba(15,93,72,0.55)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          {viewLabel}
          <ArrowRight className="ml-1.5 inline h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}
