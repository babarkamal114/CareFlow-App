"use client";
import { BrandSection } from "sections"
import { RegisterFormSection } from "sections"

export function RegisterForm() {
  return (
    <div className="flex min-h-screen bg-background">
      <BrandSection />
      <RegisterFormSection />
    </div>
  )
}

