import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-zinc-900">
          Forgot password?
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          No worries — we&apos;ll send you reset instructions.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
