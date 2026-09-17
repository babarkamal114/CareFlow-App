// src/app/subscribe/success/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, update } = useSession();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [countdown, setCountdown] = useState(5);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    
    update()
      .then(() => {
        setStatus("success");

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push("/");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      })
      .catch(() => {
        setStatus("error");
        toast.error("Failed to update subscription status");
      });
  }, [sessionId, update, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Processing your subscription...</h1>
          <p className="mt-2 text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-gray-600">
            We couldn't confirm your subscription. Please contact support.
          </p>
          <Link
            href="/subscribe"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">🎉 Subscription Activated!</h1>
        <p className="mt-2 text-gray-600">
          Your subscription has been successfully activated.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Redirecting to dashboard in {countdown}s...
        </p>
        <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-gray-200 mx-auto">
          <div
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: `${(5 - countdown) / 5 * 100}%` }}
          />
        </div>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Go to Dashboard Now
        </Link>
      </div>
    </div>
  );
}