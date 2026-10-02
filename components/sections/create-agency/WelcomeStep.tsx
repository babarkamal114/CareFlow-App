"use client";

import { Badge, Button } from "@/components/ui";
import { ArrowRight, CheckCircle2, FolderKanban, HeartHandshake, Hospital, Users } from "lucide-react";
import Image from "next/image";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: Hospital,
      title: "Create your agency profile",
      description: "Set up your agency details and branding",
    },
    {
      icon: Users,
      title: "Invite team members",
      description: "Optional — add your team for collaboration",
    },
    {
      icon: FolderKanban,
      title: "Manage care",
      description: "Start managing patients, carers, and schedules",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-8">
        <div className="space-y-5">
          <Badge badgeSize={'icon'} variant={'ghost'} shape={'rounded'}>
            <HeartHandshake className="size-14 text-primary/70" />
          </Badge>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-cf-ink-80 sm:text-4xl">
              Welcome to <span className="text-primary">CareFlow</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-cf-ink-60">
              Let's get your agency set up so you can start managing care
              effortlessly.
            </p>
          </div>
        </div>


        <div className="space-y-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cf-ink-40">
            What you'll do
          </p>
          <div className="divide-y divide-cf-ink-40/10 border-y border-cf-ink-40/10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group flex items-center gap-4 py-4 transition-colors"
                >
                  <Badge badgeSize={'icon'} shape={'rounded'} variant={'pastel-success'}>
                    <Icon size={18} className="text-primary/60"/>
                  </Badge>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-semibold text-cf-ink-80">{feature.title}</p>
                    <p className="text-sm text-cf-ink-60">{feature.description}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-cf-ink-40/50">
                    0{index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
        <Button onClick={onNext} size="lg" className="gap-2">
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Button>
        <span className="inline-flex items-center gap-1.5 text-xs text-cf-ink-40">
          <CheckCircle2 size={13} className="text-primary" />
          Takes about 2 minutes
        </span>
      </div>
    </div>
  );
}