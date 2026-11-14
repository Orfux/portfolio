"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { otherLocale } from "@/i18n/config";
import { ThemeToggle, toggleTheme } from "./theme-toggle";

export type NavItem = { href: string; label: string; key: string };

type Props = {
  locale: Locale;
  items: NavItem[];
  labels: {
    menu: string;
    close: string;
    theme: string;
    languageShort: string;
    languageLabel: string;
  };
};

/** /tr/projects -> /en/projects */
function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}

function isActive(pathname: string, href: string, locale: Locale) {
  if (href === `/${locale}`) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav({ locale, items, labels }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const langHref = switchLocalePath(pathname, otherLocale(locale));

  // Klavye kısayolları: h/a/p/b/s sayfalar, t tema, l dil.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const key = e.key.toLowerCase();
      const item = items.find((i) => i.key === key);
      if (item) router.push(item.href);
      else if (key === "t") toggleTheme();
      else if (key === "l") router.push(langHref);
      else if (key === "escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, router, langHref]);

  const linkClass = (active: boolean) =>
    `group inline-flex items-baseline gap-1 rounded-md px-2 py-1 transition ${
      active
        ? "text-zinc-900 dark:text-zinc-100"
        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    }`;

  const controls = (
    <div className="flex items-center gap-1">
      <Link
        href={langHref}
        aria-label={labels.languageLabel}
        title={`${labels.languageLabel} (l)`}
        className="grid h-8 place-items-center rounded-md px-2 font-mono text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
      >
        {labels.languageShort}
      </Link>
      <ThemeToggle label={labels.theme} />
    </div>
  );

  return (
    <>
      {/* Masaüstü */}
      <nav className="hidden items-center gap-1 text-sm sm:flex">
        <ul className="flex items-center">
          {items.map((item) => {
            const active = isActive(pathname, item.href, locale);
            return (
              <li key={item.href}>
                <Link href={item.href} className={linkClass(active)} aria-current={active ? "page" : undefined}>
                  {item.label}
                  <kbd aria-hidden className="opacity-0 transition group-hover:opacity-100">
                    {item.key}
                  </kbd>
                </Link>
              </li>
            );
          })}
        </ul>
        <span className="mx-1 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
        {controls}
      </nav>

      {/* Mobil */}
      <div className="flex items-center gap-1 sm:hidden">
        {controls}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          {open ? labels.close : labels.menu}
        </button>
      </div>
      {open && (
        <nav className="absolute inset-x-0 top-full z-20 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
          <ul className="mx-auto flex max-w-2xl flex-col">
            {items.map((item) => {
              const active = isActive(pathname, item.href, locale);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`${linkClass(active)} w-full py-2 text-base`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
