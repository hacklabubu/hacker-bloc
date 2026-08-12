import { PhotoSlot } from "@/components/site/photo-slot";

/*
 * Plain CSS-column masonry: every tile spans its full column width, so the
 * variety has to come from height instead. PhotoSlot sizes its <figure> by the
 * `ratio` we hand it and fills it with an object-cover image, which crops
 * symmetrically off the longer axis. So for a native 3:2 landscape, a box ratio
 * of `1.5 * (1 - crop)` trims exactly `crop` of the total width — split evenly
 * left and right — while keeping the shot's full height. Narrower box at a
 * fixed width means a taller tile, which is the whole point: the six
 * landscapes each get a different 11–20% side crop so the wall stacks unevenly.
 *
 * Slots 03 and 06 are exempt. They were shot vertical and rotated upright, so
 * they already break the landscape rhythm on their own, and trimming their
 * sides would eat into the subject. They keep their true 2:3 ratio, uncropped.
 *
 * `label` is a decorative caption numbering the tiles in display order, not a
 * filename reference — some photos have been dropped since, so the labels run
 * 01–08 contiguously while the `src` filenames skip numbers.
 *
 * The ratios are hardcoded rather than randomized: this is a server component,
 * so a random value would desync between the server and client renders.
 */
const WALL = [
  // 12% crop
  {
    file: "photos/wall-01.jpg",
    label: "01",
    ratio: "1.32/1",
    src: "/photos/wall-01.webp",
  },
  // 18% crop
  {
    file: "photos/wall-02.jpg",
    label: "02",
    ratio: "1.23/1",
    src: "/photos/wall-02.webp",
  },
  // portrait, uncropped
  {
    file: "photos/wall-04.jpg",
    label: "03",
    ratio: "2/3",
    src: "/photos/wall-04.webp",
  },
  // 20% crop
  {
    file: "photos/wall-05.jpg",
    label: "04",
    ratio: "1.20/1",
    src: "/photos/wall-05.webp",
  },
  // 14% crop
  {
    file: "photos/wall-06.jpg",
    label: "05",
    ratio: "1.29/1",
    src: "/photos/wall-06.webp",
  },
  // portrait, uncropped
  {
    file: "photos/wall-07.jpg",
    label: "06",
    ratio: "2/3",
    src: "/photos/wall-07.webp",
  },
  // 16% crop
  {
    file: "photos/wall-08.jpg",
    label: "07",
    ratio: "1.26/1",
    src: "/photos/wall-08.webp",
  },
  // 11% crop
  {
    file: "photos/wall-09.jpg",
    label: "08",
    ratio: "1.335/1",
    src: "/photos/wall-09.webp",
  },
] as const;

export function PhotoWall() {
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid">
      {WALL.map((p) => (
        <PhotoSlot
          key={p.file}
          label={p.label}
          file={p.file}
          src={p.src}
          ratio={p.ratio}
        />
      ))}
    </div>
  );
}
