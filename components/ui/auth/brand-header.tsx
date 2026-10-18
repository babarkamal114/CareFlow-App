"use client";

import { motion } from "framer-motion";

const BrandHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex items-center gap-3"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-base font-semibold text-white backdrop-blur-sm">
        CF
      </div>
      <div>
        <p className="font-heading text-3xl font-semibold text-white">CareFlow</p>
        <p className="text-xs uppercase tracking-widest text-white/60">
          Home Care Platform
        </p>
      </div>
    </motion.div>
  );
};

export default BrandHeader;