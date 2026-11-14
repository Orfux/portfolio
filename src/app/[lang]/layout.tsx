import type { Metadata } from "next";
import { Fira_Code, Fira_Sans } from "next/font/google";
import "../globals.css";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { bootScript } from "@/lib/theme";
import { SiteSidebar } from "@/components/site-sidebar";
import { Footer } from "@/components/footer";

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
});
const firaCode = Fira_Code({ variable: "--font-fira-code", subsets: ["latin", "latin-ext"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.title[locale]}`,
      template: `%s — ${site.name}`,
    },
    description: t.meta.description,
    alternates: {
      languages: { tr: "/tr", en: "/en" },
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${firaSans.variable} ${firaCode.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans">
        <SiteSidebar />
        <div className="main-area flex min-h-dvh flex-col transition-[padding] duration-300 lg:pl-72">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
