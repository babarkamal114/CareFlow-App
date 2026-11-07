"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { EditStaffFormValues, EditStaffModalProps } from "types";
import { getInitials } from "utils";

type UseEditStaffFormArgs = Pick<EditStaffModalProps, "staff" | "onSave" | "onOpenChange">;

export function useEditStaffForm({ staff, onSave, onOpenChange }: UseEditStaffFormArgs) {
  const [formData, setFormData] = useState<EditStaffFormValues>({
    name: staff.name,
    email: staff.email,
    phone: staff.phone || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.name.trim()) throw new Error("Name is required");
      if (!formData.email.trim()) throw new Error("Email is required");

      const changes = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
      };

      if (onSave) {
        await onSave({ id: staff.id, ...changes });
      } else {
        const response = await fetch(`/api/staff/${staff.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        });
        if (!response.ok) throw new Error("Failed to update staff member");
      }

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const initials = formData.name ? getInitials(formData.name) : "?";

  return { formData, isLoading, error, success, initials, handleChange, handleSubmit };
}
