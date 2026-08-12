"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SRC = "/photos/hero-hacker.webp";
const W = 1250;
const H = 1159;
const ALT = "Hooded builder soldering at a workbench, halftone green";

const FONT_SIZE = 15;
const CELL_W = FONT_SIZE * 0.62;
const CELL_H = FONT_SIZE * 1.05;
const COLS = Math.floor(W / CELL_W);
const ROWS = Math.floor(H / CELL_H);
const FONT = `${FONT_SIZE}px Menlo, Consolas, "DejaVu Sans Mono", monospace`;
const CHARS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*+-/<>[]{}";
const MIN_DENSITY = 0.08;
const ROLL_MS = 65;
const REROLL_CHANCE = 0.07;

// mouse shade field: the cursor darkens the glyphs it passes over
const SHADE_RADIUS = 750; // logical canvas units
const TRAIL_TAU = 0.175; // seconds; trail visually vanishes in ~0.5s
const STAMP_GAIN = 1.0; // how hard one frame deposits into the accumulator
const SHADE_STRENGTH = 0.75; // multiply alpha at the cursor: brightness drops to 25%
const IDLE_MS = 1200; // ~2x the trail: past this the residue is <0.5%, safe to clear
const AGITATE_CHANCE = 0.5; // extra reroll chance under the cursor

// 3px signal-green square, hotspot centred so it sits on the pointer
// (and therefore on the centre of the shade field)
const SQUARE_CURSOR =
  "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='3'%20height='3'%3E%3Crect%20width='3'%20height='3'%20fill='%2300ff88'/%3E%3C/svg%3E\") 1 1, crosshair";

const randomChar = () =>
  CHARS[Math.floor(Math.random() * CHARS.length)] as string;

export function DitherHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !glow || !wrap) return;
    const ctx = canvas.getContext("2d");
    const glowCtx = glow.getContext("2d");
    if (!ctx || !glowCtx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    ctx.font = FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    glow.width = W * dpr;
    glow.height = H * dpr;
    glowCtx.scale(dpr, dpr);

    // half-res accumulator: cheaper to clear/stamp, and the upscale blurs for free
    const LW = Math.round(W / 2);
    const LH = Math.round(H / 2);
    const LR = SHADE_RADIUS / 2;
    const lightCanvas = document.createElement("canvas");
    lightCanvas.width = LW;
    lightCanvas.height = LH;
    const lightCtx = lightCanvas.getContext("2d");
    if (!lightCtx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let cancelled = false;
    let raf = 0;

    // pointer state lives in closures, never state: mousemove must not re-render
    let pointerActive = false;
    let px = 0;
    let py = 0;
    let prevPx = 0;
    let prevPy = 0;
    let hasPrev = false;

    const onPointerMove = (e: PointerEvent) => {
      // rect includes md:scale-125; derive the object-contain letterbox from it
      const rect = glow.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const s = Math.min(rect.width / W, rect.height / H);
      const ox = (rect.width - W * s) / 2;
      const oy = (rect.height - H * s) / 2;
      px = (e.clientX - rect.left - ox) / s;
      py = (e.clientY - rect.top - oy) / s;
      if (!pointerActive) {
        prevPx = px;
        prevPy = py;
        hasPrev = true;
      }
      pointerActive = true;
    };

    const onPointerLeave = () => {
      pointerActive = false;
      hasPrev = false;
    };

    const img = document.createElement("img");
    img.decoding = "async";

    const start = () => {
      if (cancelled) return;
      const off = document.createElement("canvas");
      off.width = COLS;
      off.height = ROWS;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      // one pixel per glyph cell: the downscale averages source alpha into density
      offCtx.drawImage(img, 0, 0, COLS, ROWS);
      const { data } = offCtx.getImageData(0, 0, COLS, ROWS);

      const xs: number[] = [];
      const ys: number[] = [];
      const colors: string[] = [];
      const chars: string[] = [];

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const density = data[(row * COLS + col) * 4 + 3] / 255;
          if (density < MIN_DENSITY) continue;
          xs.push((col + 0.5) * CELL_W);
          ys.push((row + 0.5) * CELL_H);
          // dark --accent to bright --signal, so denser source regions read brighter
          colors.push(
            `rgb(${Math.round(13 - 13 * density)},${Math.round(
              36 + 219 * density
            )},${Math.round(24 + 112 * density)})`
          );
          chars.push(randomChar());
        }
      }

      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < chars.length; i++) {
          ctx.fillStyle = colors[i];
          ctx.fillText(chars[i], xs[i], ys[i]);
        }
      };

      draw();
      setReady(true);
      if (reduced) return;

      wrap.addEventListener("pointermove", onPointerMove);
      wrap.addEventListener("pointerleave", onPointerLeave);

      const stamp = (x: number, y: number, alpha: number) => {
        const g = lightCtx.createRadialGradient(x, y, 0, x, y, LR);
        // black under multiply: alpha a scales every channel by (1-a), so the
        // radial falloff is a pure brightness ramp with hue/saturation untouched
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(0.45, "rgba(0,0,0,0.4)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        lightCtx.globalAlpha = alpha;
        lightCtx.fillStyle = g;
        lightCtx.fillRect(x - LR, y - LR, LR * 2, LR * 2);
      };

      let lastFrame = performance.now();
      let lastRoll = lastFrame;
      let lastStampAt = -Infinity;
      let glowDirty = false;

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;

        // spent trail + absent pointer: the shade layer has nothing left to say
        const idle = !pointerActive && now - lastStampAt > IDLE_MS;

        if (!idle) {
          const decay = 1 - Math.exp(-dt / TRAIL_TAU);
          lightCtx.globalCompositeOperation = "destination-out";
          lightCtx.globalAlpha = 1;
          lightCtx.fillStyle = `rgba(0,0,0,${decay})`;
          lightCtx.fillRect(0, 0, LW, LH);

          if (pointerActive) {
            const hx = px / 2;
            const hy = py / 2;
            const fx = hasPrev ? prevPx / 2 : hx;
            const fy = hasPrev ? prevPy / 2 : hy;
            const dist = Math.hypot(hx - fx, hy - fy);
            // interpolate so a fast swipe is a streak, not a dotted line
            const steps = Math.max(1, Math.ceil(dist / (LR * 0.25)));
            // gain tied to the decay rate keeps the shade framerate-independent
            const alpha = Math.min(1, decay * STAMP_GAIN) / Math.sqrt(steps);
            lightCtx.globalCompositeOperation = "lighter";
            for (let s = 1; s <= steps; s++) {
              const t = s / steps;
              stamp(fx + (hx - fx) * t, fy + (hy - fy) * t, alpha);
            }
            lightCtx.globalAlpha = 1;
            prevPx = px;
            prevPy = py;
            hasPrev = true;
            lastStampAt = now;
          }

          lightCtx.globalCompositeOperation = "source-over";

          glowCtx.clearRect(0, 0, W, H);
          // the whole layer is scaled here, so SHADE_STRENGTH is a hard ceiling on
          // the multiply alpha == the peak brightness reduction. the reset to 1 is
          // required: destination-in at partial alpha would eat the layer's alpha
          glowCtx.globalAlpha = SHADE_STRENGTH;
          glowCtx.drawImage(lightCanvas, 0, 0, W, H);
          glowCtx.globalAlpha = 1;
          // clip to the photo silhouette: no dark disc over the empty black
          glowCtx.globalCompositeOperation = "destination-in";
          glowCtx.drawImage(img, 0, 0, W, H);
          glowCtx.globalCompositeOperation = "source-over";
          glowDirty = true;
        } else if (glowDirty) {
          // final frame of the fade: leave nothing frozen on screen
          glowCtx.clearRect(0, 0, W, H);
          lightCtx.clearRect(0, 0, LW, LH);
          glowDirty = false;
        }

        if (now - lastRoll >= ROLL_MS) {
          lastRoll = now;
          for (let i = 0; i < chars.length; i++) {
            let chance = REROLL_CHANCE;
            if (pointerActive) {
              const d = Math.hypot(xs[i] - px, ys[i] - py);
              // cells under the cursor scramble faster: the cursor "disturbs" them
              if (d < SHADE_RADIUS)
                chance += AGITATE_CHANCE * (1 - d / SHADE_RADIUS);
            }
            if (Math.random() < chance) chars[i] = randomChar();
          }
          draw();
        }
      };

      raf = requestAnimationFrame(frame);
    };

    img.onload = start;
    img.src = SRC;

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ cursor: SQUARE_CURSOR }}
      className="relative mx-auto w-full max-w-none md:origin-center md:scale-125"
    >
      <div
        className={`isolate transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      >
        <Image
          src={SRC}
          alt={ALT}
          width={W}
          height={H}
          preload
          className="h-auto max-h-[94svh] w-full max-w-none object-contain opacity-50 md:max-h-[min(96svh,62rem)]"
        />
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain"
        />
        <canvas
          ref={glowRef}
          width={W}
          height={H}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-multiply"
        />
      </div>
    </div>
  );
}
