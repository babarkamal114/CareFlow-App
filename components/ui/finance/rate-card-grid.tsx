"use client";

import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { RateCardEntry } from "types";
import { DAY_TYPE_LABEL, DAY_TYPES, formatCurrency, VISIT_DURATIONS } from "utils";

interface RateCardGridProps {
  rates: RateCardEntry[];
  onEdit: (entry: RateCardEntry) => void;
}

/** Matrix of visit length (rows) x day type (columns). Click a price to edit it. */
export function RateCardGrid({ rates, onEdit }: RateCardGridProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Visit length</TableHead>
          {DAY_TYPES.map((dayType) => (
            <TableHead key={dayType} className="text-right">{DAY_TYPE_LABEL[dayType]}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {VISIT_DURATIONS.map((duration) => (
          <TableRow key={duration}>
            <TableCell className="font-medium text-cf-ink">{duration} min</TableCell>
            {DAY_TYPES.map((dayType) => {
              const entry = rates.find((r) => r.durationMins === duration && r.dayType === dayType);
              return (
                <TableCell key={dayType} className="text-right">
                  {entry ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="tabular-nums"
                      onClick={() => onEdit(entry)}
                      aria-label={`Edit ${duration} minute ${DAY_TYPE_LABEL[dayType]} rate`}
                    >
                      {formatCurrency(entry.rate)}
                    </Button>
                  ) : (
                    <span className="text-cf-ink-40">—</span>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}