import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const year = await currentYear();

  const links = [
    { label: "Email", href: `mailto:${site.links.email}` },
    { label: "GitHub", href: site.links.github },
    { label: "LinkedIn", href: site.links.linkedin },
  ];

  return (
    <footer className="mt-24 border-t border-zinc-200/70 dark:border-zinc-800/70">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p>© {year} {site.name}</p>
          <p className="text-zinc-400 dark:text-zinc-600">{t.footer.built}</p>
        </div>
        <ul className="flex gap-4" aria-label={t.nav.connect}>
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
