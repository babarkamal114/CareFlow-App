"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

interface MedicationDeepLinkProps {
  onLink: (patientId: string, wantsAdd: boolean) => void;
}

export function MedicationDeepLink({ onLink }: MedicationDeepLinkProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handledKey = useRef<string | null>(null);

  const patientId = params.get("patientId");
  const wantsAdd = params.get("action") === "add";

  useEffect(() => {
    if (!patientId) {
      handledKey.current = null;
      return;
    }
    const key = `${patientId}|${wantsAdd}`;
    if (handledKey.current === key) return;
    handledKey.current = key;

    onLink(patientId, wantsAdd);
    if (wantsAdd) {
      router.replace(`${pathname}?patientId=${encodeURIComponent(patientId)}`, { scroll: false });
    }
  }, [patientId, wantsAdd, onLink, router, pathname]);

  return null;
}