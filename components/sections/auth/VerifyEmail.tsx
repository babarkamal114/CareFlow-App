"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

import { Button, Card, CardContent } from "@/components/ui";
import { OtpBoxes, VerifyEmailHeader } from "@/components/ui";
import { useEmailVerification } from "hooks";

export function VerifyEmailUI(): React.JSX.Element {
  const {
    handleEmailVerification,
    isError,
    loading,
    otp,
    setOtp,
    startCountdown,
    handleResend,
    canResend,
    countdown,
    formatTime,
    email,
  } = useEmailVerification();

  useEffect(() => {
    startCountdown(60);
  }, []);

  return (
    <section className="flex min-h-screen w-full items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Card className="rounded-[28px] border border-border/70 bg-background/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <CardContent className="flex flex-col items-center gap-y-6 p-8">
            <VerifyEmailHeader email={email!} />
            <OtpBoxes value={otp} setValue={setOtp} />

            {isError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500"
              >
                {isError}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full"
              onClick={handleEmailVerification}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Submit code"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                You can resend the code in:{" "}
                <span className="font-semibold text-primary/70">
                  {canResend ? "00:00" : formatTime(countdown)}
                </span>
              </p>
              <button
                onClick={handleResend}
                disabled={!canResend}
                className="mt-1 text-xs text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                {canResend ? "Resend code" : "Please wait..."}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}