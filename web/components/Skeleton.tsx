"use client";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Skeleton className="size-10 rounded-xl" />
        <Skeleton className="h-20 w-2/3 rounded-2xl" />
      </div>
      <div className="flex flex-row-reverse gap-4">
        <Skeleton className="size-10 rounded-xl" />
        <Skeleton className="h-16 w-1/2 rounded-2xl" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="size-10 rounded-xl" />
        <Skeleton className="h-24 w-3/4 rounded-2xl" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-8 space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="pt-4 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
