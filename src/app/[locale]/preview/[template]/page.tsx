import { setRequestLocale } from "next-intl/server";
import { InviteTemplate } from "@/components/invite/invite-template";
import { getDemoToi } from "@/lib/demo-toi";
import { getTheme } from "@/lib/invite-themes";

/**
 * Full-screen showcase of a single template, by id (`/preview/<id>`), rendered
 * with sample data. Unknown ids fall back to the default theme.
 */
export default async function PreviewTemplatePage({
  params,
}: {
  params: Promise<{ locale: string; template: string }>;
}) {
  const { locale, template } = await params;
  setRequestLocale(locale);
  const theme = getTheme(template);

  return (
    <div
      className="px-4 py-10 sm:py-14"
      style={{ ...theme.cssVars, background: "var(--tb)" }}
    >
      <InviteTemplate data={getDemoToi(locale)} locale={locale} theme={theme} />
    </div>
  );
}
