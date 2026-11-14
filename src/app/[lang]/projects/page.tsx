import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getProjects } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";
import { ProjectFilter } from "@/components/project-filter";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return pageMeta({ locale, path: "/projects", title: t.projects.title, description: t.projects.description });
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const projects = await getProjects(locale);

  return (
    <Container>
      <PageHeader title={t.projects.title} description={t.projects.description} />
      <ProjectFilter projects={projects} locale={locale} labels={t.categories} emptyText={t.projects.empty} />
    </Container>
  );
}
