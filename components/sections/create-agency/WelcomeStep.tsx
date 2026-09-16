// src/app/create-agency/components/WelcomeStep.tsx

"use client";

import { Button } from "@/components/ui";
import { ArrowRight, CheckCircle2, FolderKanban, Hospital, Users } from "lucide-react";
import Image from "next/image";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: <Hospital className="text-white"/>,
      title: "Create your agency profile",
      description: "Set up your agency details and branding",
    },
    {
      icon: <Users className="text-white"/>,
      title: "Invite team members",
      description: "Optional - add your team for collaboration",
    },
    {
      icon: <FolderKanban className="text-white"/>,
      title: "Manage care",
      description: "Start managing patients, carers, and schedules",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between py-8">
      <div className="space-y-10">
        <div className="space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-lg overflow-hidden">
            <Image 
            src='/logo.png'
            alt="careflow logo"
            width={80}
            height={80}
            className="object-cover"
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-[60px] font-bold text-white">
              Welcome to CareFlow
            </h1>
            <p className="max-w-md text-lg text-white/70">
              Let's get your agency set up so you can start managing care
              effortlessly.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white">
            What you'll do
          </p>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-lg border border-primary/20 bg-primary/30 p-4 "
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-xl">
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-white">{feature.title}</p>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-6">
        <Button
          onClick={onNext}
          size="lg"
          className="w-full gap-2 bg-cf-brand-500 text-base font-semibold text-white hover:bg-cf-brand-600 active:bg-cf-brand-700"
        >
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}