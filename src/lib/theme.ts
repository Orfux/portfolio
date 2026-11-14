// Tema (koyu / açık / otomatik) ve kenar çubuğu durumu.
// Tercihler localStorage'da tutulur; "otomatik" sistem temasını izler.

export type ThemePref = "dark" | "light" | "auto";

/** Sayfa boyanmadan önce <head> içinde çalışır; yanıp sönmeyi önler. */
export const bootScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);if(localStorage.getItem('sidebar')==='closed')document.documentElement.dataset.sidebar='closed'}catch(e){}})()`;

const listeners = new Set<() => void>();
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

export function getThemePref(): ThemePref {
  try {
    const t = localStorage.getItem("theme");
    return t === "dark" || t === "light" ? t : "auto";
  } catch {
    return "auto";
  }
}

function applyTheme(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "auto" && media().matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function setThemePref(pref: ThemePref) {
  try {
    if (pref === "auto") localStorage.removeItem("theme");
    else localStorage.setItem("theme", pref);
  } catch {}
  applyTheme(pref);
  listeners.forEach((l) => l());
}

export function cycleTheme() {
  const order: ThemePref[] = ["dark", "light", "auto"];
  setThemePref(order[(order.indexOf(getThemePref()) + 1) % order.length]);
}

export function subscribeTheme(cb: () => void) {
  listeners.add(cb);
  const onSystemChange = () => getThemePref() === "auto" && applyTheme("auto");
  const mq = media();
  mq.addEventListener("change", onSystemChange);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onSystemChange);
  };
}

export function toggleSidebar() {
  const root = document.documentElement;
  const closed = root.dataset.sidebar !== "closed";
  if (closed) root.dataset.sidebar = "closed";
  else delete root.dataset.sidebar;
  try {
    localStorage.setItem("sidebar", closed ? "closed" : "open");
  } catch {}
}
