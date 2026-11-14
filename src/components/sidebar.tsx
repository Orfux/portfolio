"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { otherLocale, type Locale } from "@/i18n/config";
import {
  cycleTheme,
  getThemePref,
  setThemePref,
  subscribeTheme,
  syncDocument,
  toggleSidebar,
  type ThemePref,
} from "@/lib/theme";
import { Icon, type IconName } from "./icons";

export type SidebarItem = { href: string; label: string; key: string; icon: IconName };
export type SidebarLink = { href: string; label: string; key: string; icon: IconName };

type Props = {
  locale: Locale;
  brand: { strong: string; dim: string };
  items: SidebarItem[];
  email: string;
  links: SidebarLink[];
  labels: {
    browse: string;
    connect: string;
    email: string;
    copied: string;
    dark: string;
    light: string;
    auto: string;
    collapse: string;
    expand: string;
    menu: string;
    close: string;
    language: string;
  };
};

/** /tr/projects -> /en/projects */
function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}

function isActive(pathname: string, href: string, home: string) {
  if (href === home) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="ml-auto grid h-5 min-w-5 place-items-center rounded bg-zinc-200/80 px-1 font-mono text-[10px] text-zinc-500 uppercase dark:bg-zinc-800 dark:text-zinc-400">
      {children}
    </kbd>
  );
}

const rowClass =
  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition";
const idleClass =
  "text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-white";
const activeClass = "bg-zinc-200/80 text-zinc-950 dark:bg-zinc-800 dark:text-white";

export function Sidebar({ locale, brand, items, email, links, labels }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false); // mobil çekmece
  const [copied, setCopied] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, getThemePref, () => "auto" as ThemePref);
  const home = `/${locale}`;
  const langHref = switchLocalePath(pathname, otherLocale(locale));

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  // Dil değişiminde silinen tema/kenar çubuğu durumunu boyamadan önce geri yükle.
  useLayoutEffect(() => {
    syncDocument();
  }, [locale]);

  // Klavye kısayolları (referans sitedeki gibi tek harf).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const key = e.key.toLowerCase();
      const item = items.find((i) => i.key === key);
      if (item) return router.push(item.href);
      const link = links.find((l) => l.key === key);
      if (link) return void window.open(link.href, "_blank", "noopener");
      if (key === "m") return void copyEmail();
      if (key === "l") return router.push(langHref);
      if (key === "t") return cycleTheme();
      if (key === "s") return toggleSidebar();
      if (key === "escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const themes: { value: ThemePref; label: string; icon: IconName }[] = [
    { value: "dark", label: labels.dark, icon: "moon" },
    { value: "light", label: labels.light, icon: "sun" },
    { value: "auto", label: labels.auto, icon: "wand" },
  ];

  const card = "rounded-2xl bg-zinc-100 p-2 dark:bg-zinc-900";

  return (
    <>
      {/* Mobil üst çubuk */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/85 px-4 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/85">
        <Link href={home} className="text-sm font-medium">
          <span className="text-zinc-950 dark:text-white">{brand.strong}</span>
          <span className="text-zinc-500">{brand.dim}</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={labels.menu}
          className="grid size-9 place-items-center rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <Icon name="menu" className="size-5" />
        </button>
      </div>

      {/* Masaüstünde kenar çubuğu kapalıyken açma düğmesi */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={labels.expand}
        title={`${labels.expand} (S)`}
        className="sidebar-open-btn fixed top-6 left-6 z-40 hidden size-10 place-items-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:text-zinc-950 dark:bg-zinc-900 dark:hover:text-white"
      >
        <Icon name="panel" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      <aside
        className={`sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between gap-4 overflow-y-auto p-4 transition-[translate] duration-300 lg:p-6 ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-white lg:translate-x-0 lg:bg-transparent dark:bg-zinc-950 lg:dark:bg-transparent`}
      >
        {/* Üst kart: marka + gezinme */}
        <nav className={card} aria-label={labels.browse}>
          <div className="flex items-center justify-between">
            <Link href={home} onClick={() => setOpen(false)} className={`${rowClass} ${idleClass} py-3`}>
              <span>
                <span className="text-zinc-950 dark:text-white">{brand.strong}</span>
                <span className="text-zinc-500">{brand.dim}</span>
              </span>
              <Kbd>h</Kbd>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
              className="mr-1 grid size-8 shrink-0 place-items-center rounded-lg text-zinc-500 lg:hidden"
            >
              <Icon name="x" />
            </button>
          </div>

          <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            {labels.browse}
          </p>
          <ul className="space-y-0.5">
            {items.map((item) => {
              const active = isActive(pathname, item.href, home);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`${rowClass} ${active ? activeClass : idleClass}`}
                  >
                    <Icon name={item.icon} className="size-4 text-zinc-500 group-hover:text-current" />
                    {item.label}
                    <Kbd>{item.key}</Kbd>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Alt kart: bağlantılar + tema + dil */}
        <div className={card}>
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            {labels.connect}
          </p>
          <ul className="space-y-0.5">
            <li>
              <button type="button" onClick={copyEmail} className={`${rowClass} ${idleClass}`} title={email}>
                <Icon name="mail" className="size-4 text-zinc-500 group-hover:text-current" />
                {copied ? labels.copied : labels.email}
                <Icon name={copied ? "check" : "copy"} className="size-3.5 text-zinc-500" />
                <Kbd>m</Kbd>
              </button>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer" className={`${rowClass} ${idleClass}`}>
                  <Icon name={l.icon} className="size-4 text-zinc-500 group-hover:text-current" />
                  {l.label}
                  <Icon name="arrowUpRight" className="size-3.5 text-zinc-500" />
                  <Kbd>{l.key}</Kbd>
                </a>
              </li>
            ))}
            <li>
              <Link href={langHref} onClick={() => setOpen(false)} className={`${rowClass} ${idleClass}`}>
                <Icon name="language" className="size-4 text-zinc-500 group-hover:text-current" />
                {labels.language}
                <Kbd>l</Kbd>
              </Link>
            </li>
          </ul>

          <div
            role="radiogroup"
            className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-zinc-200/70 p-1 dark:bg-zinc-950"
          >
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={theme === t.value}
                onClick={() => setThemePref(t.value)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                  theme === t.value
                    ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Icon name={t.icon} className="size-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={labels.collapse}
            title={labels.collapse}
            className={`${rowClass} ${idleClass} mt-2 hidden lg:flex`}
          >
            <Icon name="panel" className="size-4 text-zinc-500" />
            <Kbd>s</Kbd>
          </button>
        </div>
      </aside>
    </>
  );
}
