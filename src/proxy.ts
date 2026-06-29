import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the "middleware" convention to "proxy". next-intl's
// handler is unchanged — it just lives in proxy.ts now.
export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Next.js internals (_next, _vercel)
  // - files with an extension (e.g. favicon.ico, og images)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
