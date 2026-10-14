import type { LucideIcon } from "lucide-react";
import { Languages, Repeat, UserCheck } from "lucide-react";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui";
import { cn } from "lib";
import type { PreferenceViolation, PreferenceViolationType } from "types";

const PREFERENCE_META: Record<
  PreferenceViolationType,
  { title: string; Icon: LucideIcon }
> = {
  "carer-gender": { title: "Carer gender preference", Icon: UserCheck },
  language: { title: "Language preference", Icon: Languages },
  continuity: { title: "Continuity of care", Icon: Repeat },
};

interface PreferenceWarningListProps {
  violations: PreferenceViolation[];
  className?: string;
}

export function PreferenceWarningList({
  violations,
  className,
}: PreferenceWarningListProps) {
  if (violations.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {violations.map((violation) => {
        const { title, Icon } = PREFERENCE_META[violation.type];
        return (
          <Alert key={violation.type} variant="warning" className="px-3 py-2.5">
            <AlertIcon>
              <Icon />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{violation.message}</AlertDescription>
            </AlertContent>
          </Alert>
        );
      })}
    </div>
  );
}