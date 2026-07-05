import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OrnamentDivider } from "./ornament";
import { OrnamentRibbon } from "./kazakh-ornaments";
import { LogoMark } from "./logo";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="relative overflow-hidden border-t border-accent/20 bg-muted/40">
      {/* Metallic gold hairline + crisp repeating ою ribbon along the top. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.5)_20%,rgba(212,175,55,0.5)_80%,transparent)]"
      />
      <OrnamentRibbon className="absolute inset-x-0 top-0 h-8 opacity-35" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <OrnamentDivider className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <span className="font-display font-bold text-foreground">
              Toiduman
            </span>
          </div>
          <nav className="flex items-center gap-5">
            <Link href="/templates" className="hover:text-foreground">
              {t("templates")}
            </Link>
            <Link href="/create" className="hover:text-foreground">
              {t("create")}
            </Link>
          </nav>
          <p>{t("rights", { year: String(new Date().getFullYear()) })}</p>
        </div>
      </div>
    </footer>
  );
}
