import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { Container } from "@/components/ui";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return (
    <Container className="py-24">
      <p className="font-mono text-sm text-zinc-400">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{t.notFound.title}</h1>
      <p className="mt-3 text-zinc-500">{t.notFound.text}</p>
      <Link href={`/${locale}`} className="mt-6 inline-block text-sm underline underline-offset-4">
        {t.notFound.back}
      </Link>
    </Container>
  );
}
