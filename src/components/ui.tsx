import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Category, Post, Project } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function Container({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-3xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="pt-16 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
      {description && <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">{description}</p>}
    </header>
  );
}

export function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h2 className="font-mono text-xs tracking-widest text-zinc-400 uppercase dark:text-zinc-500">{title}</h2>
      {href && (
        <Link href={href} className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

const categoryStyles: Record<Category, string> = {
  web: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  automation: "bg-accent-50 text-accent-600 dark:bg-orange-950/40 dark:text-accent-400",
  ai: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
};

export function Tag({ children, category }: { children: React.ReactNode; category?: Category }) {
  const style = category
    ? categoryStyles[category]
    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{children}</span>;
}

/** Kategoriye göre basit, görsel olmayan kapak deseni. */
function CoverPattern({ category }: { category: Category }) {
  const color = {
    web: "text-sky-500/30",
    automation: "text-accent-500/40",
    ai: "text-violet-500/30",
  }[category];
  return (
    <svg className={`absolute inset-0 size-full ${color}`} aria-hidden>
      <defs>
        <pattern id={`grid-${category}`} width="24" height="24" patternUnits="userSpaceOnUse">
          {category === "automation" ? (
            <path d="M0 12h8l4-6 4 12 4-6h4" fill="none" stroke="currentColor" strokeWidth="1" />
          ) : category === "ai" ? (
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          ) : (
            <path d="M24 0H0v24" fill="none" stroke="currentColor" strokeWidth="1" />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${category})`} />
    </svg>
  );
}

export function FeaturedProject({
  project,
  locale,
  categoryLabel,
}: {
  project: Project;
  locale: Locale;
  categoryLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
    >
      <div className="relative h-40 border-b border-zinc-200 dark:border-zinc-800">
        <CoverPattern category={project.category} />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <Tag category={project.category}>{categoryLabel}</Tag>
          {project.tags.slice(0, 2).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {project.title}
        </h3>
        {project.highlight && (
          <p className="mt-1 text-2xl font-semibold tracking-tight text-accent-600 dark:text-accent-400">
            {project.highlight}
          </p>
        )}
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">{project.summary}</p>
        <span className="mt-4 inline-block text-sm text-zinc-900 transition group-hover:translate-x-1 dark:text-zinc-100">
          →
        </span>
      </div>
    </Link>
  );
}

export function ProjectRow({
  project,
  locale,
  categoryLabel,
}: {
  project: Project;
  locale: Locale;
  categoryLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group -mx-3 flex flex-col gap-1 rounded-lg px-3 py-3 transition hover:bg-zinc-100 sm:flex-row sm:items-baseline sm:gap-4 dark:hover:bg-zinc-900"
    >
      <span className="w-24 shrink-0">
        <Tag category={project.category}>{categoryLabel}</Tag>
      </span>
      <span className="flex-1">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{project.title}</span>
        <span className="block text-sm text-zinc-500 dark:text-zinc-400">{project.summary}</span>
      </span>
      <span className="shrink-0 font-mono text-xs text-zinc-400 tabular-nums">{formatDate(project.date, locale)}</span>
    </Link>
  );
}

export function PostList({ posts, locale }: { posts: Post[]; locale: Locale }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="group -mx-3 flex flex-col gap-0.5 rounded-lg px-3 py-3 transition hover:bg-zinc-100 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 dark:hover:bg-zinc-900"
          >
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{post.title}</span>
            <time dateTime={post.date} className="shrink-0 font-mono text-xs text-zinc-400 tabular-nums">
              {formatDate(post.date, locale)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
