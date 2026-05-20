"use client";
// features/patients/components/ui/patient-avatar.tsx
// Initials avatar with deterministic soft color from patient name

import { cn } from "@/lib/utils";

// 8 soft palette options — index chosen deterministically from name chars
const COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100   text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100  text-amber-700",
  "bg-rose-100   text-rose-700",
  "bg-cyan-100   text-cyan-700",
  "bg-pink-100   text-pink-700",
  "bg-orange-100 text-orange-700",
];

interface PatientAvatarProps {
  initials: string;
  displayName: string;
  size?: "sm" | "md";
}

export function PatientAvatar({ initials, displayName, size = "sm" }: PatientAvatarProps) {
  // Pick color from first two chars so same patient always gets same color
  const idx = ((displayName.charCodeAt(0) ?? 0) + (displayName.charCodeAt(1) ?? 0)) % COLORS.length;

  return (
    <span
      className={cn(
        "rounded-full flex items-center justify-center font-bold flex-shrink-0",
        COLORS[idx],
        size === "sm" ? "w-7 h-7 text-[10px]" : "w-10 h-10 text-sm",
      )}
    >
      {initials}
    </span>
  );
}
