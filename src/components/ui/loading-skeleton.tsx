'use client';

interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'list' | 'detail';
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({ type = 'table', rows = 4, className = '' }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className={`grid gap-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="size-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
        <div className="space-y-3">
          <div className="h-3 bg-muted rounded w-full animate-pulse" />
          <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-muted rounded w-4/6 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-muted rounded animate-pulse" />
          <div className="h-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 p-3 flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded w-20 animate-pulse" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-3 flex gap-4 border-t border-border">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-3 bg-muted rounded w-20 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
