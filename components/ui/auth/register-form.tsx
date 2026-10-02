"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, Loader2, LockKeyholeIcon, MailIcon, PhoneIcon, UserRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button, Input, Label, toast } from "@/components/ui";
import { cn } from "lib";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type RegisterFormProps = {
  className?: string;
};

const RegisterForm = ({ className }: RegisterFormProps) => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phoneNumber,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        toast.error(data.message ?? "Signup failed");
        setLoading(false);
        return;
      }

      toast.success("Account created — check your email to verify");
      router.push("/login");
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full space-y-5", className)}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Full name
        </Label>
        <div className="relative">
          <UserRoundIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Enter your full name"
            className="h-11 pl-10"
          />
        </div>
      </motion.div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </Label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@careflow.app"
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone number
          </Label>
          <div className="relative">
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="07123 456789"
              className="h-11 pl-10"
            />
          </div>
        </div>
      </motion.div>

      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <div className="relative">
            <LockKeyholeIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm password
          </Label>
          <div className="relative">
            <LockKeyholeIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your password"
              className="h-11 pl-10"
            />
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <Button type="submit" disabled={loading} className="h-11 w-full gap-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default RegisterForm;