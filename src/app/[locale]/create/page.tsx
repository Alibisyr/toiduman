import { setRequestLocale } from "next-intl/server";
import { CreateWizard } from "@/components/wizard/create-wizard";

export default async function CreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CreateWizard />;
}
