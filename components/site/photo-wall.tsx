import { PhotoSlot } from "@/components/site/photo-slot";
import { Reveal } from "@/components/site/reveal";

/* masonry-ish wall: varied aspect ratios, CSS columns, no captions */
const WALL = [
  { file: "photos/wall-01.jpg", label: "wall_01", ratio: "4/3" },
  { file: "photos/wall-02.jpg", label: "wall_02", ratio: "3/4" },
  { file: "photos/wall-03.jpg", label: "wall_03", ratio: "1/1" },
  { file: "photos/wall-04.jpg", label: "wall_04", ratio: "16/9" },
  { file: "photos/wall-05.jpg", label: "wall_05", ratio: "3/4" },
  { file: "photos/wall-06.jpg", label: "wall_06", ratio: "4/3" },
  { file: "photos/wall-07.jpg", label: "wall_07", ratio: "1/1" },
  { file: "photos/wall-08.jpg", label: "wall_08", ratio: "4/3" },
] as const;

export function PhotoWall() {
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid">
      {WALL.map((p, i) => (
        <Reveal key={p.file} delay={i * 50}>
          <PhotoSlot label={p.label} file={p.file} ratio={p.ratio} />
        </Reveal>
      ))}
    </div>
  );
}
