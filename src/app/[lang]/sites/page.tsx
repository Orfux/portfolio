import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { otherSites } from "@/lib/site";
import { Container, PageHeader, SiteCard } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.sites.title, description: t.sites.description };
}

export default async function SitesPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <Container>
      <PageHeader title={t.sites.title} description={t.sites.description} />
      <ul className="grid gap-4 sm:grid-cols-2">
        {otherSites.map((s) => (
          <li key={s.url}>
            <SiteCard site={s} locale={locale} visitLabel={t.sites.visit} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
