import { cn } from "~/utils/utils";

function Skeleton({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...properties} />;
}

export { Skeleton };
