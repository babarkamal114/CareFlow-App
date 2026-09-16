// components/sections/staff/PermissionTableSkeleton.tsx
'use client';

import { Skeleton } from "@/components/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { PERMISSION_MODULES } from "utils";

export const PERMISSIONS_TABLE_HEADER_COLUMNS = [
  { label: 'Module' },
  { label: 'Read' },
  { label: 'Create' },
  { label: 'Update' },
  { label: 'Delete' },
  { label: 'All' },
];

export function PermissionTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {PERMISSIONS_TABLE_HEADER_COLUMNS.map((header) => (
                <TableHead key={header.label}>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {PERMISSION_MODULES.map((module) => (
              <TableRow key={module.id}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}