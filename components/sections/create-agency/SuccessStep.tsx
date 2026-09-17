// src/app/create-agency/components/SuccessStep.tsx

"use client";

import { Button } from "@/components/ui";
import { CheckCircle2, ArrowRight, Sparkles, Loader, LayoutDashboard, UsersRound, UserCog } from "lucide-react";

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
      icon: <LayoutDashboard className="text-white"/>,
      title: "View Dashboard",
      description: "See an overview of your agency metrics",
    },
    {
      icon: <UsersRound className="text-white"/>,
      title: "Manage Clients",
      description: "Add and organize your care recipients",
    },
    {
      icon: <UserCog className="text-white"/>,
      title: "Manage Staff",
      description: "Keep track of your care professionals",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between py-8">

      <div className="space-y-10 text-center">

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-xl" />
            <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <p className="text-sm font-semibold uppercase tracking-widest text-green-400">
              All Set!
            </p>
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Agency Created Successfully
          </h1>
          <p className="mx-auto max-w-md text-lg text-white/70">
            Your agency is now set up and ready to manage care. Let's get you
            started.
          </p>
        </div>


        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Profile", value: "✓" },
            { label: "Owner", value: "✓" },
            { label: "Ready", value: "✓" },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <p className="text-xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            What's Next
          </p>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-lg">
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-white">{step.title}</p>
                  <p className="text-sm text-white/60">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {error && (
          <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-3 text-left">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>


      <div className="space-y-3 pt-6">
        <Button
          onClick={onCreateAgency}
          disabled={isCreating}
          size="lg"
          className="w-full gap-2 bg-primary text-base font-semibold text-white hover:bg-primary/80 active:bg-primary/90 disabled:bg-white/10 disabled:text-white/40"
        >
          {isCreating ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Creating Agency...
            </>
          ) : (
            "Create Agency"
          )}
        </Button>
        <p className="text-center text-xs text-white/40">
          You can manage everything from your dashboard
        </p>
      </div>
    </div>
  );
}