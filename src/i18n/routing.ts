import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Kazakh is the primary brand language; Russian is fully supported.
  locales: ["kk", "ru"],
  defaultLocale: "kk",
  // Always show the locale in the URL (/kk, /ru). "/" redirects to the default.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
