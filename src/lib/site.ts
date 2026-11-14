import type { Locale } from "@/i18n/config";

/**
 * Sitenin genel bilgileri. Gerçek bilgilerinle burayı güncelle.
 * TODO: isim, unvan, e-posta, GitHub/LinkedIn ve domain.
 */
export const site = {
  name: "Orhun",
  title: {
    tr: "Otomasyon & Yazılım Geliştirici",
    en: "Automation & Software Developer",
  } satisfies Record<Locale, string>,
  url: "https://orhunserbetci.com",
  links: {
    email: "mail@example.com",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
};

export type OtherSite = {
  name: string;
  url: string;
  description: Record<Locale, string>;
  tags: string[];
};

/**
 * Subdomain'lerde yayında olan diğer siteler.
 * Yeni bir site eklemek için bu listeye bir öğe ekle.
 * TODO: açıklamaları ve etiketleri gerçek bilgilerle güncelle.
 */
export const otherSites: OtherSite[] = [
  {
    name: "Florya Aydın",
    url: "https://floryaaydin.orhunserbetci.com",
    description: {
      tr: "Florya Aydın web sitesi.",
      en: "Florya Aydın website.",
    },
    tags: ["Web"],
  },
];
