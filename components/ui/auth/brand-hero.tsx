"use client";

import { motion } from "framer-motion";

const BrandHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
        Simplifying care,
        <br />
        empowering teams.
      </h2>
      <p className="max-w-125 text-base leading-7 text-white/75 sm:text-lg">
        The all-in-one platform for managing home care visits, compliance, and
        workforce — built for UK domiciliary care agencies.
      </p>
    </motion.div>
  );
};

export default BrandHero;