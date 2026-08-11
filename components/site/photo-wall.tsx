import { PhotoSlot } from "@/components/site/photo-slot";

const WALL = [
  { file: "photos/wall-01.jpg", label: "01", ratio: "4/3" },
  { file: "photos/wall-02.jpg", label: "02", ratio: "3/4" },
  { file: "photos/wall-03.jpg", label: "03", ratio: "1/1" },
  { file: "photos/wall-04.jpg", label: "04", ratio: "16/9" },
  { file: "photos/wall-05.jpg", label: "05", ratio: "3/4" },
  { file: "photos/wall-06.jpg", label: "06", ratio: "4/3" },
  { file: "photos/wall-07.jpg", label: "07", ratio: "1/1" },
  { file: "photos/wall-08.jpg", label: "08", ratio: "4/3" },
] as const;

export function PhotoWall() {
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid">
      {WALL.map((p) => (
        <PhotoSlot key={p.file} label={p.label} file={p.file} ratio={p.ratio} />
      ))}
    </div>
  );
}
