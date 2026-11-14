// next/root-params yalnızca sunucuda çalışır; istemciye sızarsa build hata verir.
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import type tr from "./dictionaries/tr.json";

export type Dictionary = typeof tr;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

/** URL'deki dili (/tr, /en) okur; desteklenmiyorsa 404 verir. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}
