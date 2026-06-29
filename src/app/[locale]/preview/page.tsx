import { setRequestLocale } from "next-intl/server";
import { InviteTemplate } from "@/components/invite/invite-template";
import { getDemoToi } from "@/lib/demo-toi";

/**
 * Showcase route for the flagship "Dala" invitation template, rendered with
 * sample data so it can be reviewed end-to-end without the wizard.
 * The real public invite (`/i/[slug]`) will reuse <InviteTemplate> with stored
 * ToiData.
 */
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="bg-paper px-4 py-10 sm:py-14">
      <InviteTemplate data={getDemoToi(locale)} locale={locale} />
    </div>
  );
}
