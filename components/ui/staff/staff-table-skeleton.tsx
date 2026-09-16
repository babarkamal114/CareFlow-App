import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Skeleton } from "@/components/ui";

export function StaffTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full h-full rounded-lg border border-cf-border bg-cf-surface">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-cf-border-light hover:bg-transparent">
              <TableHead className="w-12 px-4">
                <Skeleton className="h-4 w-4 rounded bg-cf-surface-muted" />
              </TableHead>
              <TableHead className="text-cf-ink-60">
                <Skeleton className="h-4 w-20 rounded bg-cf-surface-muted" />
              </TableHead>
              <TableHead className="text-cf-ink-60">
                <Skeleton className="h-4 w-24 rounded bg-cf-surface-muted" />
              </TableHead>
              <TableHead className="text-cf-ink-60">
                <Skeleton className="h-4 w-12 rounded bg-cf-surface-muted" />
              </TableHead>
              <TableHead className="text-cf-ink-60">
                <Skeleton className="h-4 w-14 rounded bg-cf-surface-muted" />
              </TableHead>
              <TableHead className="text-cf-ink-60">
                <Skeleton className="h-4 w-20 rounded bg-cf-surface-muted" />
              </TableHead>
              <TableHead className="w-12 text-cf-ink-60">
                <Skeleton className="h-4 w-4 rounded bg-cf-surface-muted ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow 
                key={index} 
                className="border-b border-cf-border-light hover:bg-transparent"
              >
                {/* Checkbox */}
                <TableCell className="px-4">
                  <Skeleton className="h-4 w-4 rounded bg-cf-surface-muted" />
                </TableCell>

                {/* Employee (Avatar + Name) */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full border border-cf-border-light bg-cf-surface-muted shrink-0" />
                    <Skeleton className="h-4 w-28 rounded bg-cf-surface-muted" />
                  </div>
                </TableCell>

                {/* Contact Info (Email + Phone) */}
                <TableCell>
                  <div className="flex flex-col">
                    <Skeleton className="h-4 w-36 rounded bg-cf-surface-muted" />
                    <Skeleton className="h-3 w-24 rounded bg-cf-surface-muted mt-2" />
                  </div>
                </TableCell>

                {/* Role Pill */}
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full bg-cf-surface-muted" />
                </TableCell>

                {/* Status Pill */}
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full bg-cf-surface-muted" />
                </TableCell>

                {/* Join Date */}
                <TableCell>
                  <Skeleton className="h-4 w-20 rounded bg-cf-surface-muted" />
                </TableCell>

                {/* Actions Icon */}
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md bg-cf-surface-muted ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}