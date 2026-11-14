// Proje kategorileri. İstemci bileşenleri de kullandığı için content.ts'ten
// (dosya sistemi erişimi var) ayrı tutulur.
export const categories = ["automation", "energy", "ai", "web"] as const;
export type Category = (typeof categories)[number];
