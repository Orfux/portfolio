import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";

// Tüm arama motorlarına ve yapay zekâ botlarına (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended…) siteyi gezme izni verir.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absUrl("/sitemap.xml"),
    host: absUrl("/"),
  };
}
