import { Skeleton, TableCell, TableRow } from "@/components/ui";
import {
  PATIENTS_TABLE_SKELETON_CELLS,
  PATIENTS_TABLE_SKELETON_ROWS,
} from "utils";

/** Loading rows for the patients table. Place inside <TableBody>. */
export function PatientTableSkeleton() {
  return (
    <>
      {Array.from({ length: PATIENTS_TABLE_SKELETON_ROWS }).map((_, row) => (
        <TableRow key={row} className="border-b border-cf-border-light">
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-36" />
              </div>
            </div>
          </TableCell>
          {PATIENTS_TABLE_SKELETON_CELLS.map((shape, cell) => (
            <TableCell key={cell}>
              <Skeleton className={shape} />
            </TableCell>
          ))}
          <TableCell />
        </TableRow>
      ))}
    </>
  );
}