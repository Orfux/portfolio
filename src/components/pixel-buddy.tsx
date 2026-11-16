"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Sayfanın altında yürüyen piksel karakter.
 * Varlıklar: public/buddy/walk.png (6 kare yan yana, her kare 96×192),
 *            public/buddy/turn.png (durma pozu, 96×192),
 *            public/buddy/wave.png (isteğe bağlı: WAVE_FRAMES kare el sallama).
 * Ekranda 2 kat küçük gösterilir (48×96) — Retina'da net görünsün diye.
 */
const W = 48;
const H = 96;
const WALK_FRAMES = 6;
const WAVE_FRAMES = 0; // wave.png eklenince kare sayısını yaz (ör. 4)
const FRAME_MS = 115;
const SPEED = 40; // px/sn

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function PixelBuddy({ hello, label }: { hello: string; label: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLButtonElement>(null);
  const greetRef = useRef<() => void>(() => {});
  const [greeting, setGreeting] = useState(false);

  useEffect(() => {
    const track = trackRef.current, mover = moverRef.current, sprite = spriteRef.current;
    if (!track || !mover || !sprite) return;

    const maxX = () => Math.max(0, track.clientWidth - W);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let x = Math.min(48, maxX());
    let dir = 1;
    let mode: "walk" | "greet" = "walk";
    let until = performance.now() + rand(5000, 11000);
    let frame = 0;
    let lastFrame = 0;
    let last = performance.now();
    let raf = 0;

    const draw = () => {
      mover.style.transform = `translateX(${Math.round(x)}px)`;
      sprite.style.transform = `scaleX(${dir})`;
    };
    const show = (img: string, f: number) => {
      sprite.style.backgroundImage = `url(${img})`;
      sprite.style.backgroundPosition = `${-f * W}px 0`;
    };

    const greet = (now = performance.now()) => {
      mode = "greet";
      until = now + (WAVE_FRAMES ? 2800 : 2400);
      frame = 0;
      if (!WAVE_FRAMES) show("/buddy/turn.png", 0);
      setGreeting(true);
    };
    const walk = (now: number) => {
      mode = "walk";
      until = now + rand(5000, 11000);
      setGreeting(false);
    };
    greetRef.current = () => greet();

    if (reduce) {
      x = Math.max(0, maxX() - 24);
      show("/buddy/turn.png", 0);
      draw();
      return;
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const nextFrame = now - lastFrame > FRAME_MS;
      if (nextFrame) lastFrame = now;

      if (mode === "walk") {
        x += dir * SPEED * dt;
        if (x >= maxX()) { x = maxX(); dir = -1; }
        if (x <= 0) { x = 0; dir = 1; }
        if (nextFrame) { frame = (frame + 1) % WALK_FRAMES; show("/buddy/walk.png", frame); }
        if (now > until) greet(now);
      } else {
        if (WAVE_FRAMES && nextFrame) { frame = (frame + 1) % WAVE_FRAMES; show("/buddy/wave.png", frame); }
        if (now > until) walk(now);
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    show("/buddy/walk.png", 0);
    draw();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={trackRef}
      className="buddy-track pointer-events-none fixed inset-x-0 bottom-0 z-20 lg:left-72"
      style={{ height: H + 4 }}
    >
      <div ref={moverRef} className="absolute bottom-1 left-0" style={{ width: W, height: H }}>
        {/* Konuşma balonu (karakterle birlikte çevrilmez) */}
        <span
          aria-hidden
          className={`absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-lg bg-zinc-900 px-2 py-1 font-mono text-[11px] whitespace-nowrap text-white shadow-sm transition-opacity duration-300 dark:bg-white dark:text-zinc-900 ${
            greeting ? "opacity-100" : "opacity-0"
          }`}
        >
          {hello}
        </span>
        {/* Zemin gölgesi */}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-1/2 h-1.5 w-7 -translate-x-1/2 rounded-full bg-black/15 blur-[1px] dark:bg-white/10"
        />
        <button
          ref={spriteRef}
          type="button"
          aria-label={label}
          title={label}
          onClick={() => greetRef.current()}
          className="pointer-events-auto absolute inset-0 cursor-pointer bg-no-repeat dark:drop-shadow-[0_0_1px_rgba(255,255,255,0.55)]"
          style={{ backgroundSize: `auto ${H}px` }}
        />
      </div>
    </div>
  );
}
