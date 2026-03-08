export function BookSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Cover */}
      <div className="aspect-[3/4] skeleton-shimmer" />

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded skeleton-shimmer" />
          <div className="h-4 w-1/2 rounded skeleton-shimmer" />
        </div>

        <div className="h-4 w-20 rounded skeleton-shimmer" />

        <div className="space-y-1">
          <div className="h-3 w-full rounded skeleton-shimmer" />
          <div className="h-3 w-4/5 rounded skeleton-shimmer" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-16 rounded skeleton-shimmer" />
          <div className="flex gap-2">
            <div className="h-8 w-16 rounded skeleton-shimmer" />
            <div className="h-8 w-20 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BookSkeleton key={i} />
      ))}
    </div>
  );
}
