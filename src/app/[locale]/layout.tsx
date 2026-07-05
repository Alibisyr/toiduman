import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Inter, Cormorant, Great_Vibes } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import "../globals.css";

// Both families ship Cyrillic + Cyrillic Extended, covering Kazakh glyphs
// (ә ғ қ ң ө ұ ү һ і).
const display = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap",
});

// Invitation-template faces. Cormorant = high-contrast wedding serif for
// headings/dates; Great Vibes = formal calligraphy for the hosts' names.
// Both cover Kazakh Cyrillic via cyrillic-ext.
const serif = Cormorant({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Toiduman — онлайн шақыру тойға",
    template: "%s · Toiduman",
  },
  description:
    "Тойға әдемі онлайн шақыру бірнеше минутта. Ақпаратты енгізіп, үлгіні таңдап, сілтемені қонақтарға жіберіңіз.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${serif.variable} ${script.variable} h-full antialiased`}
      // The `js-anim-init` script below adds `.js-anim` to <html> before React
      // hydrates (for no-flash GSAP), so the class list intentionally differs
      // from the server HTML. Suppress the resulting attribute mismatch warning.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {/*
          Mark the document for GSAP choreography before first paint, so the
          pre-animation hidden states apply with no flash. Skipped when the
          visitor prefers reduced motion; <ScrollChoreography> removes the class
          again if GSAP cannot load.
        */}
        <Script id="js-anim-init" strategy="beforeInteractive">
          {`(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-anim')}}catch(e){}})()`}
        </Script>
        <NextIntlClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
