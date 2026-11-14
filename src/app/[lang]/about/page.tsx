import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { loadAbout } from "@/lib/content";
import { Container, PageHeader } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.about.title };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const About = await loadAbout(locale);

  return (
    <Container>
      <PageHeader title={t.about.title} />
      <article className="prose prose-zinc dark:prose-invert prose-a:text-accent-600 dark:prose-a:text-accent-400 max-w-none">
        <About />
      </article>
    </Container>
  );
}
