import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { Sidebar, type SidebarItem, type SidebarLink } from "./sidebar";

export async function SiteSidebar() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const base = `/${locale}`;

  const items: SidebarItem[] = [
    { href: `${base}/about`, label: t.nav.about, key: "a", icon: "user" },
    { href: `${base}/projects`, label: t.nav.projects, key: "p", icon: "layers" },
    { href: `${base}/blog`, label: t.nav.blog, key: "y", icon: "pen" },
    { href: `${base}/sites`, label: t.nav.sites, key: "d", icon: "globe" },
  ];

  const links: SidebarLink[] = [
    { href: site.links.github, label: "GitHub", key: "g", icon: "github" },
    { href: site.links.linkedin, label: "LinkedIn", key: "k", icon: "linkedin" },
  ];

  return (
    <Sidebar
      locale={locale}
      brand={site.brand}
      items={items}
      email={site.links.email}
      links={links}
      labels={{
        browse: t.nav.browse,
        connect: t.nav.connect,
        email: t.nav.email,
        copied: t.nav.copied,
        dark: t.theme.dark,
        light: t.theme.light,
        auto: t.theme.auto,
        collapse: t.nav.collapse,
        expand: t.nav.expand,
        menu: t.nav.menu,
        close: t.nav.close,
        language: t.language.name,
      }}
    />
  );
}
