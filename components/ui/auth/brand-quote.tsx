"use client";

import { motion } from "framer-motion";

const BrandQuote = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-[24px] border border-white/20 bg-white/10 p-6 backdrop-blur-md"
    >
      <p className="text-lg leading-8 text-white/90">
        &ldquo;CareFlow cut our admin time by 60% and we passed our CQC
        inspection with Outstanding.&rdquo;
      </p>
      <div className="mt-4">
        <p className="font-semibold text-white">Sarah Williams</p>
        <p className="text-sm text-white/70">Registered Manager, Sunrise Care</p>
      </div>
    </motion.div>
  );
};

export default BrandQuote;