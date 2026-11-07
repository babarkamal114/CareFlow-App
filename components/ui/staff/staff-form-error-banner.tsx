"use client";


import type { StaffFormErrorBannerProps } from "types";
import { getErrorMessages } from "utils";

export function StaffFormErrorBanner({
  errors,
  title = "Please fix the following before continuing",
}: StaffFormErrorBannerProps) {
  const messages = getErrorMessages(errors);

  if (messages.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
    >
      <p className="text-sm font-semibold text-destructive">{title}</p>
      <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
        {messages.map((message) => (
          <li key={message} className="text-xs text-destructive">
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
}
