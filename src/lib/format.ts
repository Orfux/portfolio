import { dateLocale, type Locale } from "@/i18n/config";

/** Yazı listeleri için kısa, büyük harfli tarih: "12 EKİ 2025" / "12 OCT 2025". */
export function formatShortDate(date: string, locale: Locale) {
  const [y, m = 1, d = 1] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const loc = dateLocale[locale];
  const day = String(d).padStart(2, "0");
  const month = new Intl.DateTimeFormat(loc, { month: "short", timeZone: "UTC" })
    .format(dt)
    .replace(".", "")
    .toLocaleUpperCase(loc);
  return `${day} ${month} ${y}`;
}

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
