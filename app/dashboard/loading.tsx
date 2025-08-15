import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-4">
      {/* Page title skeleton */}
      <Skeleton className="h-6 w-48" />

      {/* Small card grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
