"use client";

import { motion } from "framer-motion";

import { BrandHeader, BrandHero, BrandQuote } from "@/components/ui";

const BrandSection = () => {
  return (
    <aside className="relative hidden w-[42%] flex-col overflow-hidden bg-primary text-white lg:flex">
      {/* Subtle gradient overlays, matching original AuthBrandPanel */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.25)_0%,_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.07)_0%,_transparent_50%)]" />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5" />

      <div className="relative z-10 p-8">
        <BrandHeader />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 px-10 pb-10">
        <BrandHero />
        <BrandQuote />
      </div>
    </aside>
  );
};

export default BrandSection;