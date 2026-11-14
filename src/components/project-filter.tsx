"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Category, Project } from "@/lib/content";
import { categories } from "@/lib/categories";
import { ProjectRow } from "./ui";

type Props = {
  projects: Project[];
  locale: Locale;
  labels: Record<"all" | Category, string>;
  emptyText: string;
};

export function ProjectFilter({ projects, locale, labels, emptyText }: Props) {
  const [active, setActive] = useState<"all" | Category>("all");
  const filters = (["all", ...categories] as const).map((key) => ({
    key,
    count: key === "all" ? projects.length : projects.filter((p) => p.category === key).length,
  }));
  const visible = active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div role="tablist" className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={active === f.key}
            onClick={() => setActive(f.key)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              active === f.key
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
            }`}
          >
            {labels[f.key]} <span className="ml-1 font-mono text-xs opacity-60">{f.count}</span>
          </button>
        ))}
      </div>
      {visible.length ? (
        <ul>
          {visible.map((p) => (
            <li key={p.slug}>
              <ProjectRow project={p} locale={locale} categoryLabel={labels[p.category]} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-500">{emptyText}</p>
      )}
    </div>
  );
}
