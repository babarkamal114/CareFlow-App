export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cf-red-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-cf-red-500">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cf-red-500 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-cf-red-500" />
      </span>
      LIVE
    </span>
  );
}
