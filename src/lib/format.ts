import { dateLocale, type Locale } from "@/i18n/config";

/** "2025", "2025-03" veya "2025-03-14" biçimindeki tarihi yerel biçimde yazar. */
export function formatDate(date: string, locale: Locale) {
  const parts = date.split("-").map(Number);
  const d = new Date(Date.UTC(parts[0], (parts[1] ?? 1) - 1, parts[2] ?? 1));
  return new Intl.DateTimeFormat(dateLocale[locale], {
    year: "numeric",
    month: parts[1] ? "short" : undefined,
    day: parts[2] ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(d);
}
