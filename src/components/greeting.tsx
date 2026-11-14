"use client";

import { useSyncExternalStore } from "react";

type Labels = {
  default: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
};

function period(): keyof Labels {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18 && h < 23) return "evening";
  return "night";
}

const subscribe = () => () => {};

/** Ziyaretçinin kendi saatine göre selamlama. Sunucuda genel "Merhaba". */
export function Greeting({ labels }: { labels: Labels }) {
  const key = useSyncExternalStore(subscribe, period, () => "default" as const);
  return <>{labels[key]}</>;
}
