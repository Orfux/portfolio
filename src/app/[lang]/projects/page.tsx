import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getProjects } from "@/lib/content";
import { Container, PageHeader } from "@/components/ui";
import { ProjectFilter } from "@/components/project-filter";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.projects.title, description: t.projects.description };
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
