// İstemci ve sunucu tarafında güvenle kullanılabilen dil ayarları.
export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const otherLocale = (locale: Locale): Locale =>
  locale === "tr" ? "en" : "tr";

export const dateLocale: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
};
