import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Florya Aydın sitesi eskiden ana domain'deydi; artık subdomain'de.
const FLORYA = "https://floryaaydin.orhunserbetci.com";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Temel güvenlik başlıkları (tüm sayfalar).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // Eski orhunserbetci.com/... Florya linklerini subdomain'e taşı (query korunur).
  async redirects() {
    return [
      { source: "/:page(.*\\.html)", destination: `${FLORYA}/:page`, permanent: true },
      { source: "/hesabim", destination: `${FLORYA}/hesabim`, permanent: true },
      { source: "/assets/:path*", destination: `${FLORYA}/assets/:path*`, permanent: true },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    // Turbopack eklentileri isimle (string) alır.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
