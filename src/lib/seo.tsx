import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { site } from "./site";

/*
 * Arama motorları ve yapay zekâ arama araçları (ChatGPT, Perplexity, Claude,
 * Google AI) için ortak SEO yardımcıları.
 */

export const absUrl = (path: string) => new URL(path, site.url).toString();

const ogLocale: Record<Locale, string> = { tr: "tr_TR", en: "en_US" };

/** Sayfa için canonical + TR/EN karşılıkları + OpenGraph/Twitter etiketleri. */
export function pageMeta({
  locale,
  path = "",
  title,
  description,
  type = "website",
  publishedTime,
}: {
  locale: Locale;
  /** "" (ana sayfa), "/about", "/blog/slug"… */
  path?: string;
  title?: string;
  description?: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.title[locale]}`;
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { tr: `/tr${path}`, en: `/en${path}`, "x-default": `/tr${path}` },
    },
    openGraph: {
      type,
      siteName: site.name,
      locale: ogLocale[locale],
      alternateLocale: ogLocale[locale === "tr" ? "en" : "tr"],
      url: `/${locale}${path}`,
      title: fullTitle,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
      ...(publishedTime && { publishedTime }),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export const personId = `${site.url}/#person`;

/** "Bu kişi kim?" sorusunun makine tarafından okunabilir cevabı (schema.org Person). */
export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: site.url,
    email: `mailto:${site.links.email}`,
    jobTitle: site.title[locale],
    description:
      locale === "tr"
        ? "Endüstriyel otomasyon, PLC/HMI-SCADA, enerji sistemleri ve yapay zekâ destekli projeler üzerine çalışan elektrik-elektronik mühendisi."
        : "Electrical & electronics engineer working on industrial automation, PLC/HMI-SCADA, energy systems and AI-assisted projects.",
    address: { "@type": "PostalAddress", addressLocality: "Aydın", addressCountry: "TR" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Kütahya Dumlupınar Üniversitesi" },
    knowsLanguage: ["tr", "en", "de"],
    knowsAbout: [
      "Industrial automation",
      "PLC programming",
      "HMI/SCADA",
      "Siemens TIA Portal",
      "Delta ISPSoft",
      "Mitsubishi GX Works2",
      "EPLAN",
      "Modbus",
      "VFD",
      "Energy Management Systems (EMS)",
      "Battery Energy Storage Systems (BESS)",
      "Solar energy",
      "Biogas power generation",
      "Deep learning",
      "Computer vision",
    ],
    sameAs: [site.links.linkedin, site.links.github],
  };
}

/** JSON-LD'yi güvenli şekilde <script> olarak basar. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
