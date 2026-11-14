import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { Nav, type NavItem } from "./nav";

export async function Header() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const base = `/${locale}`;

  const items: NavItem[] = [
    { href: base, label: t.nav.home, key: "h" },
    { href: `${base}/about`, label: t.nav.about, key: "a" },
    { href: `${base}/projects`, label: t.nav.projects, key: "p" },
    { href: `${base}/blog`, label: t.nav.blog, key: "b" },
    { href: `${base}/sites`, label: t.nav.sites, key: "s" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <div className="relative mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href={base} className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{site.name}</span>
          <span className="hidden text-zinc-400 md:inline">{site.title[locale]}</span>
        </Link>
        <Nav
          locale={locale}
          items={items}
          labels={{
            menu: t.nav.menu,
            close: t.nav.close,
            theme: t.theme.toggle,
            languageShort: t.language.short,
            languageLabel: t.language.switchLabel,
          }}
        />
      </div>
    </header>
  );
}
