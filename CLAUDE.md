# orhunserbetci.com — kişisel portfolyo

@AGENTS.md

Bu dosya, projeye başka bir bilgisayardan devam eden Claude için bağlamdır.
Ayrıntılı geçmiş: `docs/sohbet-ozeti.md`.

## Kullanıcı ile çalışma

- **Her zaman Türkçe yaz.** Kullanıcı hızlı ve yazım hatalı yazar; niyeti anla.
- Rutin adımlar için izin isteme, işi kendin bitir ("her şeyi kendin yap"). Domain kaldırma, silme gibi geri alınması zor işlemleri önce açıkla.
- Key/token'ı sohbete yapıştırmasını isteme; CLI'larda tarayıcıdan giriş (`gh auth login --web`, `vercel login`) kullan.
- **Gizlilik:** CV'deki telefon, not ortalaması ve askerlik bilgisi siteye KONMAZ. Yayında olanlar: ad, e-posta (orhunsrbtc@gmail.com), LinkedIn, GitHub (Orfux).
- `src/content/posts` altındaki yazılar kalıcıdır, kullanıcı "silmeyeceğiz" dedi.

## Proje

Tasarım referansı: https://paul.hanaoka.co (solda iki kartlı sabit kenar çubuğu, Fira Sans/Fira Code, büyük ince hero yazısı + yuvarlak fotoğraf, öne çıkan proje + son yazılar yan yana).

- **Next.js 16.4 (App Router, Turbopack) + Tailwind v4 + MDX**, TypeScript.
- Diller: `/tr` (varsayılan) ve `/en`. `src/proxy.ts` (Next 16'da middleware'in adı) dil öneki olmayan adresleri tarayıcı diline göre yönlendirir.
- Tema: Koyu / Açık / Oto (`src/lib/theme.ts`). `<html class="dark">` + localStorage. Dil değişince React kök `<html>`'i yeniden kurar; `Sidebar` içindeki `syncDocument()` durumu geri yükler.

### Next.js 16 tuzakları (bu projede yaşandı)

- `cacheComponents: true` + `partialPrefetching: true` açık.
- `dynamicParams` export'u build'i bozar; olmayan slug için `notFound()` kullan.
- Dinamik sayfalarda (`[slug]`) `params`, `<Suspense>` içinde await edilmeli (bkz. `projects/[slug]/page.tsx`).
- Dosya sistemi okuyan veri fonksiyonları `"use cache"` ile işaretli (`src/lib/content.ts`).
- Dil `next/root-params` ile okunur (`getLocale()` in `src/i18n/dictionaries.ts`).
- İstemci bileşenleri `src/lib/content.ts`'i import edemez (node:fs). Ortak tipler: `src/lib/categories.ts`, `src/lib/format.ts`.

### İçerik nerede?

| Ne | Nerede |
|---|---|
| Ad, unvan, linkler, fotoğraf (`photo`), diğer siteler | `src/lib/site.ts` |
| Arayüz metinleri (TR/EN) | `src/i18n/dictionaries/{tr,en}.json` |
| Projeler | `src/content/projects/{tr,en}/<slug>.mdx` (`export const metadata = {...}`) |
| Yazılar | `src/content/posts/{tr,en}/<slug>.mdx` |
| Hakkımda | `src/content/about/{tr,en}.mdx` |
| Site ekran görüntüleri | `public/sites/*.png` |

Proje kategorileri: `automation`, `energy`, `ai`, `web` (`src/lib/categories.ts` + sözlüklerdeki `categories`). Aynı slug her iki dilde de olmalı.

## Yayın ve altyapı

- **GitHub:** `Orfux/portfolio` (private), dal `main`.
- **Vercel** (hesap `orhunsrbtc-3567`, takım `orfux`):
  - `portfolio` projesi → `orhunserbetci.com` (+ `www` → 308 ana domain).
  - `florya` projesi → `floryaaydin.orhunserbetci.com`; `florya-pi.vercel.app` da oraya 308.
  - Vercel ↔ GitHub otomatik deploy **henüz bağlı değil** (kullanıcı Vercel'de GitHub Login Connection eklemeli, sonra `npx vercel@65.16.0 git connect`). O zamana kadar: `npx vercel@65.16.0 deploy --prod --yes`.
- **DNS:** Domain Hostinger'da kayıtlı, nameserver Hostinger (`dns-parking.com`). Kayıtlar: `A @ 216.198.79.1`, `CNAME www → orhunserbetci.com`, `CNAME floryaaydin → b05186f310f183ca.vercel-dns-017.com`. Yeni subdomain = Vercel projesine domain ekle + Hostinger'a CNAME.
- **Florya Aydın** sitesinin kodu bu depoda değil (ayrı Vercel projesi). Supabase projesi `ksrhxhkpieuwapylkyqe`; Site URL ve Redirect URL'leri subdomain'e göre güncellendi.
- `next.config.ts`: eski `orhunserbetci.com/*.html`, `/hesabim`, `/assets/*` linklerini Florya subdomain'ine 308 yönlendirir; güvenlik başlıkları burada.

## SEO / yapay zekâ araması

- `src/lib/seo.tsx`: `pageMeta()` (canonical, hreflang, OpenGraph, Twitter) — her yeni sayfanın `generateMetadata`'sı bunu kullanmalı. `personJsonLd()` layout'ta; yazılarda `BlogPosting`, projelerde `CreativeWork` JSON-LD var.
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/llms.txt/route.ts` içerikten otomatik üretilir; yeni proje/yazı ekleyince elle güncelleme gerekmez.
- `public/og.png` paylaşım görseli (ana sayfanın 1200×630 ekran görüntüsü). Fotoğraf eklenince yeniden üret.

## Doğrulama

- `npm run build` ve `npm run lint` temiz olmalı.
- Görsel kontrol: kurulu Edge + `playwright-core` (`chromium.launch({ channel: "msedge" })`), projeyi kirletmemek için scratch klasöründe kur.
- İlk bilgisayarda internet sağlayıcısı `*.vercel.app` adreslerini engelliyordu; canlıyı `curl --resolve orhunserbetci.com:443:216.198.79.1` ile test et.

## Piksel karakter (PixelBuddy)

- `src/components/pixel-buddy.tsx`: sayfanın altında yürür, arada durup selam verir, tıklanınca selam verir; `prefers-reduced-motion`'da durur.
- Varlıklar `public/buddy/`: `walk.png` (6 kare × 96×192, sağa bakan), `turn.png` (3/4 durma pozu). Ekranda 48×96 gösterilir.
- Kullanıcı kareleri ChatGPT ile üretiyor; **kendin kare üretme/çizme** ("hayır üretme, ne lazımsa söyle" dedi). Ham görseller AI çıktısı: alfa eşikle (≥128), kareleri sütun projeksiyonuyla ayır, kafa merkezi + ayak çizgisine hizala, alan ortalamasıyla 96×192'ye küçült.
- **El sallama kareleri bekleniyor** (`wave.png`, önden 4 kare). Gelince `public/buddy/wave.png` olarak koy ve bileşendeki `WAVE_FRAMES` değerini ayarla.

## Açık işler

- Kullanıcı diğer projelerin ekran görüntülerini/bilgilerini gönderecek. (Fotoğraf eklendi: `public/me.jpg`.)
- El sallama sprite'ı (yukarıya bak).
- Florya'nın kendi `sitemap.xml`'i hâlâ `orhunserbetci.com/...` adreslerini gösteriyor (Florya deposunda düzeltilmeli).
- Vercel ↔ GitHub bağlantısı; Vercel hesabında 2FA açılması önerildi.
- Tıbbi atık fırını ("2025") ve Florya ("2026") proje tarihleri tahmini; kullanıcı onaylamadı.
