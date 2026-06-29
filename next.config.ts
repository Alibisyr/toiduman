import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json in the home directory
  // otherwise makes Turbopack guess the wrong root.
  turbopack: { root: projectRoot },
  images: {
    // Supabase Storage (and any other remote media) is allowed here.
    // Replace once the friend provisions the Supabase project if a tighter
    // hostname is preferred.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
