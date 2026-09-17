'use client'

import { useSendVerificationCodeApi, useVerifyUserEmailApi } from "lib";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface UseEmailVerificationReturn {
    otp: string;
    email: string | null | undefined;
    isError: string | null;
    handleEmailVerification: () => Promise<void>;
    handleResend: () => Promise<void>;
    startCountdown: (seconds?: number) => void;
    formatTime: (seconds: number) => string;
    setOtp: (otp: string) => void;
    canResend: boolean;
    countdown: number;
    loading: boolean;
    success: boolean;
}

export function useEmailVerification(): UseEmailVerificationReturn {
    const router = useRouter()
    const [otp , setOtp] = useState('')
    const [isError, setIsError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(true);

    const {data: session , update} = useSession()
    const accessToken = session?.accessToken as string
    const email = session?.user.email

    const {mutateAsync ,  isPending , isSuccess, error} = useVerifyUserEmailApi()
    const {mutateAsync: sendCode, error: resendError} = useSendVerificationCodeApi()


    useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Start countdown
  const startCountdown = (seconds: number = 120) => {
    setCanResend(false);
    setCountdown(seconds);
  };

    const handleResendVerificationCode = async () => {
        const data = await sendCode({accessToken})
        if (data.success === true) {
            toast.success("Verification code resent!");
            startCountdown(120);
        }

        if (resendError) {
            toast.error(resendError.message)
        }

    }

    const handleEmailVerification = async () => {
        setIsError(null)
        const data = await mutateAsync({code : otp , accessToken})
        if (data.success) {
            await update()
            toast.success('Email verified successfully')
            router.push('/')
        }
        if (error) {
            toast.error('error verifying email')
            setIsError(error.message!)
        }
    }

    return {
        otp,
        email,
        isError,

        handleEmailVerification,
        handleResend : handleResendVerificationCode,
        startCountdown,
        formatTime,
        setOtp,

        canResend,
        countdown,

        loading: isPending,
        success: isSuccess
    }
}