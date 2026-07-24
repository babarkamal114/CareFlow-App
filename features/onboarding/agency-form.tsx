"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button, Input, Label } from "ui-components";

const AGENCY_TYPES = ["Domiciliary care", "Live-in care", "Both"];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export interface AgencyFormPayload {
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  postcode: string;
  type: string;
  locations: string;
}

export interface AgencyFormProps {
  onSubmit?: (data: AgencyFormPayload) => Promise<{ error?: string | null }>;
}

export function AgencyForm({ onSubmit }: AgencyFormProps) {
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AgencyFormPayload>({
    name: "",
    registrationNumber: "",
    address: "",
    city: "",
    postcode: "",
    type: AGENCY_TYPES[0],
    locations: "1",
  });

  function update(field: keyof AgencyFormPayload, value: string): void {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) : Promise<void> {
    e.preventDefault();
    if (!onSubmit) return;
    setError(null);
    setPending(true);
    try {
      const res = await onSubmit(form);
      if (res?.error) {
        setError(res.error);
      } else {
        setCreated(true);
      }
    } catch {
      setError("Couldn't create your agency. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (created) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4 rounded-xl border border-green-100 bg-green-50 p-8 text-center"
      >
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1.6, 1], opacity: [0.4, 0] }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute h-12 w-12 rounded-full bg-[#1a6b3c]"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
          >
            <CheckCircle2 className="h-12 w-12 text-[#1a6b3c]" />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
        >
          <p className="text-lg font-semibold text-zinc-900">Agency created</p>
          <p className="mt-1 text-sm text-zinc-500">
            Taking you to your dashboard...
          </p>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 1.4, ease: "linear" }}
          className="mx-auto h-1 w-32 origin-left rounded-full bg-[#1a6b3c]/20"
        >
          <motion.div className="h-full rounded-full bg-[#1a6b3c]" style={{ width: "100%" }} />
        </motion.div>
      </motion.div>
    );
  }
  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="agency-name" className="text-sm font-medium text-zinc-700">
          Agency name
        </Label>
        <Input
          id="agency-name"
          placeholder="Sunrise Care Ltd"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
          className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all"
        />
      </motion.div>

      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="reg-number" className="text-sm font-medium text-zinc-700">
          CQC registration number
        </Label>
        <Input
          id="reg-number"
          placeholder="1-123456789"
          value={form.registrationNumber}
          onChange={(e) => update("registrationNumber", e.target.value)}
          required
          className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all"
        />
      </motion.div>

      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="address" className="text-sm font-medium text-zinc-700">
          Address
        </Label>
        <Input
          id="address"
          placeholder="12 High Street"
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          required
          className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all"
        />
      </motion.div>

      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium text-zinc-700">
            City
          </Label>
          <Input
            id="city"
            placeholder="Manchester"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            required
            className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postcode" className="text-sm font-medium text-zinc-700">
            Postcode
          </Label>
          <Input
            id="postcode"
            placeholder="M1 1AE"
            value={form.postcode}
            onChange={(e) => update("postcode", e.target.value)}
            required
            className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all"
          />
        </div>
      </motion.div>

      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="agency-type" className="text-sm font-medium text-zinc-700">
          Agency type
        </Label>
        <div className="relative">
          <select
            id="agency-type"
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            className="h-10 w-full appearance-none rounded-md border border-zinc-200 bg-white px-3 pr-9 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-[#1a6b3c] transition-all cursor-pointer"
          >
            {AGENCY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </motion.div>

      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="space-y-1.5">
        <Label htmlFor="locations" className="text-sm font-medium text-zinc-700">
          Number of service locations
        </Label>
        <Input
          id="locations"
          type="number"
          min={1}
          value={form.locations}
          onChange={(e) => update("locations", e.target.value)}
          required
          className="h-10 border-zinc-200 bg-white text-sm placeholder:text-zinc-400 focus-visible:ring-[#1a6b3c] focus-visible:border-[#1a6b3c] transition-all"
        />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md px-3 py-2"
        >
          {error}
        </motion.p>
      )}

      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
        <Button
          type="submit"
          disabled={pending}
          className="h-10 w-full bg-[#1a6b3c] hover:bg-[#155c32] text-white font-medium transition-all shadow-sm hover:shadow-md"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create agency"}
        </Button>
      </motion.div>
    </form>
  );
}