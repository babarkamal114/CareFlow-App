// src/app/create-agency/components/AgencyDetailStep.tsx

"use client";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { AlertCircle } from "lucide-react";

interface AgencyFormData {
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
}

interface AgencyDetailsStepProps {
  formData: AgencyFormData;
  updateField: (field: keyof AgencyFormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export function AgencyDetailsStep({
  formData,
  updateField,
  onNext,
  onBack,
}: AgencyDetailsStepProps) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //TODO:add validation here zartab
    onNext()
  };

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col justify-between py-8">
      <div className="space-y-8">

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Agency Details</h2>
          <p className="text-base text-white/70">
            Tell us about your agency so we can personalize your experience.
          </p>
        </div>


        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-white">
              Agency Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g., CareFlow London"
              className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/30 focus:bg-white/10"
              required
            />
            <p className="text-xs text-white/60">The name customers will see</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-white">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="020 7123 4567"
              className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/30 focus:bg-white/10"
            />
            <p className="text-xs text-white/60">Used for important notifications</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-semibold text-white">
              Address
            </Label>
            <Input
              id="address"
              type="text"
              value={formData.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 High Street"
              className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/30 focus:bg-white/10"
            />
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-semibold text-white">
                City
              </Label>
              <Input
                id="city"
                type="text"
                value={formData.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="London"
                className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/30 focus:bg-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-sm font-semibold text-white">
                Postcode
              </Label>
              <Input
                id="postcode"
                type="text"
                value={formData.postcode || ""}
                onChange={(e) => updateField("postcode", e.target.value)}
                placeholder="SW1A 1AA"
                className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/30 focus:bg-white/10"
              />
            </div>
          </div>
        </div>
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
          type="submit"
          className="flex-1 gap-2 bg-primary text-base font-semibold text-white hover:bg-primary/80 active:bg-primary/90 disabled:bg-white/10 disabled:text-white/40"
        >
          Next
        </Button>
      </div>
    </form>
  );
}