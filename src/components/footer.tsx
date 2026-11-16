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

  return (
    // pb-32: yürüyen piksel karakter alt bilgi yazısını kapatmasın.
    <footer className="mx-auto mt-24 w-full max-w-6xl px-5 pb-32 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-1 border-t border-zinc-200 pt-6 text-sm text-zinc-500 sm:flex-row sm:justify-between dark:border-zinc-800/80">
        <p>
          © {year} {site.name}
        </p>
        <p>{t.footer.built}</p>
      </div>
    </footer>
  );
}
