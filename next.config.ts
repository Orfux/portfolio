import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Florya Aydın sitesi eskiden ana domain'deydi; artık subdomain'de.
const FLORYA = "https://floryaaydin.orhunserbetci.com";

const nextConfig: NextConfig = {
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
