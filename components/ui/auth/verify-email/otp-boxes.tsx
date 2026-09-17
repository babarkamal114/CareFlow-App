"use client";

import { motion } from "framer-motion";


import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../input-otp";

export interface OtpBoxesProps {
  value: string;
  setValue: (value: string) => void;
}

const OtpBoxes = ({ value, setValue }: OtpBoxesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center"
    >
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </motion.div>
  );
};

export default OtpBoxes;