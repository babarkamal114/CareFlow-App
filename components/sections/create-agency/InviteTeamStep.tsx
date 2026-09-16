

"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { X, Plus, Mail, AlertCircle } from "lucide-react";

interface InviteTeamStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function InviteTeamStep({ onNext, onBack, onSkip }: InviteTeamStepProps) {
  const [emails, setEmails] = useState<string[]>(["", ""]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === "" || emailRegex.test(email);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);

    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const handleRemove = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const handleAddAnother = () => {
    setEmails([...emails, ""]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<number, string> = {};
    const filledEmails = emails.filter((email) => email.trim() !== "");

    filledEmails.forEach((email, index) => {
      const actualIndex = emails.indexOf(email);
      if (!validateEmail(email)) {
        newErrors[actualIndex] = "Invalid email address";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  const hasFilledEmails = emails.some((email) => email.trim() !== "");

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between py-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Invite Your Team</h2>
          <p className="text-base text-white/70">
            Add team members to collaborate on your agency. They'll receive an
            invitation email to join.
          </p>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-blue-400">
          <p className="font-medium">💡 Tip:</p>
          <p className="mt-1 text-white/70">
            You can invite team members now or add them later from settings.
          </p>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-white">
            Team Member Emails
          </Label>

          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-white/40" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder="name@company.com"
                      className={`border-white/10 bg-primary/50 pl-10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/30 focus:bg-primary/60 ${
                        errors[index]
                          ? "border-red-400/50 focus:border-red-400 focus:ring-red-400/20"
                          : ""
                      }`}
                    />
                  </div>
                  {emails.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(index)}
                      className="h-10 w-10 text-white/40 hover:bg-white/10 hover:text-white/80"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors[index] && (
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors[index]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={handleAddAnother}
            className="gap-2 text-primary hover:bg-white/10 hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
            Add another member
          </Button>
        </div>

        {hasFilledEmails && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <p className="text-sm text-green-400">
              {emails.filter((e) => e.trim() !== "").length} team member
              {emails.filter((e) => e.trim() !== "").length !== 1 ? "s" : ""} to
              invite
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 border-t border-white/10 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
        >
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
        >
          Skip for now
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-primary text-base font-semibold text-white hover:bg-primary/80 active:bg-primary/90 disabled:bg-white/10 disabled:text-white/40"
        >
          Send Invites
        </Button>
      </div>
    </form>
  );
}