"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export interface VerifyEmailHeaderProps {
  email: string;
}

const VerifyEmailHeader = ({ email }: VerifyEmailHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
      >
        <Mail className="h-8 w-8 text-primary" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="text-2xl font-bold text-foreground"
      >
        Verify your email
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="mt-2 text-sm text-muted-foreground"
      >
        We sent a 6-digit verification code to
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="text-sm font-medium text-foreground"
      >
        {email}
      </motion.p>
    </div>
  );
};

export default VerifyEmailHeader;