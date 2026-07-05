import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { LogoMark } from "./logo";

export function SiteHeader() {
  const t = useTranslations("Nav");

  const links = [
    { href: "/templates", label: t("templates") },
    { href: "/#pricing", label: t("pricing") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-accent/20 bg-background/80 backdrop-blur-md">
      {/* Metallic gold hairline along the very bottom edge of the header. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(212,175,55,0.5)_20%,rgba(212,175,55,0.5)_80%,transparent)]"
      />
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="h-9 w-9" />
          <span className="font-display text-lg font-bold tracking-tight">
            Toiduman
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/create"
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            {t("create")}
          </Link>
        </div>
      </div>
    </header>
  );
}
