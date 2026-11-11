import Link from "next/link";
import { Avatar, AvatarFallback, Button } from "@/components/ui";
import type { DashboardVisit } from "types";
import { getDashboardInitials } from "utils";

interface VisitPatientCellProps {
  visit: DashboardVisit;
  href?: string;
}

export function VisitPatientCell({ visit, href }: VisitPatientCellProps) {
  const content = (
    <>
      <Avatar size="default">
        <AvatarFallback className="bg-brand-50 text-brand-700">
          {getDashboardInitials(visit.patientName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-cf-ink">{visit.patientName}</p>
        <p className="truncate text-xs text-cf-ink-60">{visit.careType}</p>
      </div>
    </>
  );

  if (!href) return <div className="flex items-center gap-3">{content}</div>;

  return (
    <Button
      variant="ghost"
      nativeButton={false}
      render={<Link href={href} />}
      className="h-auto w-full min-w-0 justify-start gap-3 whitespace-normal p-0 text-left font-normal hover:bg-transparent"
    >
      <span className="sr-only">Open profile: </span>
      {content}
    </Button>
  );
}