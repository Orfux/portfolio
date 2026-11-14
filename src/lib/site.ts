import type { Locale } from "@/i18n/config";

/**
 * Sitenin genel bilgileri. Gerçek bilgilerinle burayı güncelle.
 * TODO: tam isim, e-posta, GitHub/LinkedIn ve fotoğraf.
 */
export const site = {
  name: "Orhun",
  title: {
    tr: "Otomasyon & Yazılım Geliştirici",
    en: "Automation & Software Developer",
  } satisfies Record<Locale, string>,
  /** Kenar çubuğunun üstündeki marka yazısı: kalın + soluk kısım */
  brand: { strong: "orhun", dim: "serbetci.com" },
  /** Ana sayfadaki yuvarlak fotoğraf. public/ altına koyup yolunu yaz, ör. "/me.jpg". Boşsa baş harf gösterilir. */
  photo: "",
  url: "https://orhunserbetci.com",
  links: {
    email: "mail@example.com",
    github: "https://github.com/Orfux",
    linkedin: "https://www.linkedin.com/",
  },
};

export type OtherSite = {
  name: string;
  url: string;
  description: Record<Locale, string>;
  tags: string[];
  /** public/ altındaki ekran görüntüsü, ör. "/sites/florya.png" */
  image?: string;
};

/**
 * Subdomain'lerde yayında olan diğer siteler.
 * Yeni bir site eklemek için bu listeye bir öğe ekle.
 */
export const otherSites: OtherSite[] = [
  {
    name: "Florya Aydın",
    url: "https://floryaaydin.orhunserbetci.com",
    description: {
      tr: "Aydın Efeler'de çiçekçi için online sipariş sitesi: ürün kataloğu, sepet, üyelik ve yönetim paneli.",
      en: "Online ordering site for a florist in Aydın: product catalog, cart, accounts and an admin panel.",
    },
    tags: ["Web", "Supabase", "E-ticaret"],
    image: "/sites/florya.png",
  },
];
