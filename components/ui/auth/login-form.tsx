"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, Loader2, LockKeyholeIcon, MailIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { Button, Checkbox, Input, Label, toast } from "@/components/ui";
import { cn } from "lib";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type LoginFormProps = {
  className?: string;
};

const LoginForm = ({ className }: LoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      toast.success("Logged In Successfully");
      router.push("/");
      
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full space-y-6", className)}>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
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
      </motion.div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
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
            placeholder="Enter your password"
            className="h-11 pl-10"
          />
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 p-3"
        >
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2"
      >
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
          />
          Keep me signed in
        </label>
        <span className="text-sm text-primary">
          <Link href={""}>Forgot password</Link>
        </span>
      </motion.div>

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <Button type="submit" disabled={loading} className="h-11 w-full gap-2">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRightIcon className="size-4" />
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default LoginForm;