"use client";
import { BrandSection } from "sections"
import { FormSection } from "sections"


export function LoginForm() {
  return (
     <div className="flex min-h-screen bg-background">
      <BrandSection />
      <FormSection />
    </div>
  );
}