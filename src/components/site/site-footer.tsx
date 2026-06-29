import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OrnamentDivider } from "./ornament";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border/70 bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <OrnamentDivider className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-base font-bold">
              T
            </span>
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
