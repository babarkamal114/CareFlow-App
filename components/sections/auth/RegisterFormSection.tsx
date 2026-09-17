"use client";

import { motion } from "framer-motion";

import { RegisterForm } from "@/components/ui";

const RegisterFormSection = () => {
  return (
    <section className="flex min-h-screen flex-1 items-center justify-center bg-[#F6F7F9] px-6 py-12 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <RegisterFormHeader />
        <div className="mt-7">
          <RegisterForm />
        </div>
        <RegisterFormFooter />
      </motion.div>
    </section>
  );
};

const RegisterFormHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
    >
      <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Start your free 14-day trial. No credit card required.
      </p>
    </motion.div>
  );
};

const RegisterFormFooter = () => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.35 }}
      className="mt-6 text-center text-sm text-zinc-500"
    >
      Already have an account?{" "}
      <a href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
        Sign in
      </a>
    </motion.p>
  );
};

export default RegisterFormSection;