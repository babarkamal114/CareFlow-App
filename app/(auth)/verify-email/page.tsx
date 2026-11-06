'use client'

import { Particles } from "@/components/ui"
import { useEmailVerification } from "@/hooks";
import { useEffect } from "react";
import { VerifyEmailUI } from "sections"

const Page = () => {

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
      startCountdown(60)
    }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Particles
        className="absolute inset-0 z-0"
        color={isError ? "#ef4444" : "#22c55e"}
        quantity={100}
      />
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <VerifyEmailUI
          email={email!}
          otp={otp}
          setOtp={setOtp}
          handleEmailVerification={handleEmailVerification}
          handleResend={handleResend}
          isError={isError}
          loading={loading}
          canResend={canResend}
          countdown={countdown}
          formatTime={formatTime}
        />
      </div>
    </div>
  )
}

export default Page