const VLOG_ID = "ZA1CCcHrcLI";

export function Error529() {
  return (
    <div className="relative w-full overflow-hidden border border-border bg-charcoal aspect-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${VLOG_ID}`}
        title="Error 529"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
