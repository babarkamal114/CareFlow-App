"use client";

import { Badge, Button } from "@/components/ui";
import { CheckCircle2, Loader, LayoutDashboard, UsersRound, UserCog } from "lucide-react";

interface SuccessStepProps {
  onCreateAgency: () => void;
  isCreating: boolean;
  error: string | null;
  agencyName: string;
}

export function SuccessStep({
  onCreateAgency,
  isCreating,
  error,
  agencyName,
}: SuccessStepProps) {
  const nextSteps = [
    {
      icon: LayoutDashboard,
      title: "View Dashboard",
      description: "See an overview of your agency metrics",
    },
    {
      icon: UsersRound,
      title: "Manage Clients",
      description: "Add and organize your care recipients",
    },
    {
      icon: UserCog,
      title: "Manage Staff",
      description: "Keep track of your care professionals",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-8">
        <div className="space-y-5">
          <Badge badgeSize={'icon'} shape={'rounded'} variant={'pastel-success'}>
            <CheckCircle2 size={48} className="text-primary" />
          </Badge>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              All set{agencyName ? ` — ${agencyName}` : ""}
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-cf-ink-80 sm:text-4xl">
              Agency created successfully
            </h1>
            <p className="max-w-md text-base leading-relaxed text-cf-ink-60">
              Your agency is now set up and ready to manage care. Let's get you
              started.
            </p>
          </div>
        </div>

        <div className="flex divide-x divide-cf-ink-40/10 border-y border-cf-ink-40/10">
          {["Profile", "Owner", "Ready"].map((label) => (
            <div
              key={label}
              className="flex flex-1 items-center justify-center gap-2 py-3.5"
            >
              <CheckCircle2 size={14} className="text-primary" />
              <span className="text-sm font-semibold text-cf-ink-60">{label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cf-ink-40">
            What's next
          </p>
          <div className="divide-y divide-cf-ink-40/10 border-y border-cf-ink-40/10">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="group flex items-center gap-4 py-4 transition-colors"
                >
                  <Badge
                    badgeSize={'icon'}
                    shape={'rounded'}
                    variant={'pastel-success'}
                    className=""
                  >
                    <Icon size={18} className="text-primary/70"/>
                  </Badge>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-semibold text-cf-ink-80">{step.title}</p>
                    <p className="text-sm text-cf-ink-60">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-8">
        <Button
          onClick={onCreateAgency}
          disabled={isCreating}
          size="lg"
          className="w-full gap-2"
        >
          {isCreating ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Creating agency...
            </>
          ) : (
            "Create Agency"
          )}
        </Button>
        <p className="text-center text-xs text-cf-ink-40">
          You can manage everything from your dashboard
        </p>
      </div>
    </div>
  );
}