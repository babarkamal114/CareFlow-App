"use client";

import { motion } from "framer-motion";

import { LoginForm } from "@/components/ui";

const FormSection = () => {
  return (
    <section className="flex min-h-screen flex-1 items-center justify-center bg-[#F6F7F9] px-6 py-12 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <FormSectionHeader />
        <div className="mt-7">
          <LoginForm />
        </div>
        <FormSectionFooter />
      </motion.div>
    </section>
  );
};

const FormSectionHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
    >
      <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">
        Welcome back
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Sign in to your CareFlow account
      </p>
    </motion.div>
  );
};

const FormSectionFooter = () => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.35 }}
      className="mt-6 text-center text-sm text-zinc-500"
    >
      New to CareFlow?{" "}
      <a href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
        Create an account
      </a>
    </motion.p>
  );
};

export default FormSection;