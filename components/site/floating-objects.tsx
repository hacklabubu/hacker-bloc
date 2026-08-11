import Image from "next/image";

/**
 * Hardware cutouts that revolve around the section center. All ten share one
 * 60s linear orbit (`hb-orbit`) on a single perfect circle; equal spacing comes
 * from a per-item negative animation-delay — -6s steps = 36° apart — so the ring
 * is already fully populated on the first frame. The radius is `--orbit-r` from
 * globals.css, a min() of viewport width/height so the circle never crosses the
 * viewport edges. The trailing counter-rotation in the keyframes keeps each item
 * upright as it circles. `hb-spawn` on the outer anchor blooms each item outward
 * from the center along its orbit arm on load, staggered by spawnDelay. w/h are
 * source pixel dimensions.
 */
const OBJECTS = [
  { src: "/objects/tbot.webp",    w: 800, h: 268, size: "w-40 xl:w-48", orbitDelay: "0s",   spawnDelay: "0.1s" },
  { src: "/objects/mini.webp",    w: 390, h: 136, size: "w-24 xl:w-28", orbitDelay: "-6s",  spawnDelay: "0.18s" },
  { src: "/objects/dog.webp",     w: 535, h: 332, size: "w-32 xl:w-40", orbitDelay: "-12s", spawnDelay: "0.26s" },
  { src: "/objects/glasses.webp", w: 321, h: 157, size: "w-24 xl:w-28", orbitDelay: "-18s", spawnDelay: "0.34s" },
  { src: "/objects/rov.webp",     w: 376, h: 204, size: "w-28 xl:w-32", orbitDelay: "-24s", spawnDelay: "0.42s" },
  { src: "/objects/arm.webp",     w: 289, h: 565, size: "w-14 xl:w-16", orbitDelay: "-30s", spawnDelay: "0.5s" },
  { src: "/objects/rover.webp",   w: 344, h: 255, size: "w-28 xl:w-32", orbitDelay: "-36s", spawnDelay: "0.58s" },
  { src: "/objects/gripper.webp", w: 360, h: 262, size: "w-28 xl:w-32", orbitDelay: "-42s", spawnDelay: "0.66s" },
  { src: "/objects/fpv.webp",     w: 368, h: 253, size: "w-28 xl:w-32", orbitDelay: "-48s", spawnDelay: "0.74s" },
  { src: "/objects/quad.webp",    w: 480, h: 193, size: "w-32 xl:w-36", orbitDelay: "-54s", spawnDelay: "0.82s" },
] as const;

export function FloatingObjects() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {OBJECTS.map((o, i) => (
        // anchor at ring center + entrance bloom
        <div
          key={`${o.src}-${i}`}
          className={`hb-spawn pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${o.size}`}
          style={{ animationDelay: o.spawnDelay }}
        >
          {/* shared orbit; negative delay sets the start angle */}
          <div className="hb-orbit" style={{ animationDelay: o.orbitDelay }}>
            <Image
              src={o.src}
              alt=""
              width={o.w}
              height={o.h}
              className="h-auto w-full drop-shadow-[0_0_14px_rgba(0,255,136,0.35)] transition-transform duration-300 ease-out hover:scale-125"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
