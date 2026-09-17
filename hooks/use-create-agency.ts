

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCreateAgencyApi } from "lib";


interface AgencyFormData {
  name: string;
  phone?: string | undefined;
  slug: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  postcode?: string | undefined;
}

export function useCreateAgency() {
  const router = useRouter();
  const { data: session, update } = useSession();

  const [formData, setFormData] = useState<AgencyFormData>({
    name: "",
    slug: 'test-agency',
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });

  const { mutate: createAgency, isPending, error } = useCreateAgencyApi();

  const updateField = (field: keyof AgencyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (onSuccess?: () => void) => {
    if (!formData.name.trim()) {
      toast.error("Agency name is required");
      return;
    }

    createAgency(
      {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          slug: formData.slug,
          accessToken: session?.accessToken as string
      },
      {
        onSuccess: async (data) => {
          toast.success(data.message || "Agency created!");
          await update();
          if (onSuccess) onSuccess();
          router.push("/");
        },
      }
    );
  };

  return {
    formData,
    isLoading: isPending,
    updateField,
    handleSubmit,
    setFormData,
    error: error?.message
  };
}