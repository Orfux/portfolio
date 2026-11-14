import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";

// Dil öneki olmayan adresleri (/, /projects ...) tarayıcı diline göre
// /tr veya /en altına yönlendirir.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return;

  const preferred = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase())
    .find(hasLocale);

  const url = request.nextUrl.clone();
  url.pathname = `/${preferred ?? defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // _next, api ve uzantılı dosyaları (favicon.ico, resimler) atla.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
