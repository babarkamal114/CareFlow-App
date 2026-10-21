"use client";

import { toast } from "@/components/ui";
import { COMPLIANCE_MOCK_TODAY, mockSignatures } from "lib";
import { useMemo, useState } from "react";
import type { SignDocumentFormData, SignatureItem } from "types";
import { countSignatures } from "utils";

export function useDigitalSignatures() {
  const [items, setItems] = useState<SignatureItem[]>(mockSignatures);
  const [signingId, setSigningId] = useState<string | null>(null);

  const counts = useMemo(() => countSignatures(items), [items]);
  const signing = items.find((i) => i.id === signingId) ?? null;

  const sign = (data: SignDocumentFormData) => {
    if (!signing) return;
    // Mock clock: today's mock date with the real time of day.
    const now = new Date();
    const stamp = new Date(COMPLIANCE_MOCK_TODAY);
    stamp.setHours(now.getHours(), now.getMinutes(), 0, 0);

    setItems((prev) =>
      prev.map((i) => (i.id === signing.id ? { ...i, status: "signed", signedAt: stamp, signedBy: data.fullName.trim() } : i)),
    );
    setSigningId(null);
    toast.success(`${signing.document} signed`);
  };

  return {
    items, counts, signing, asOf: COMPLIANCE_MOCK_TODAY,
    openSign: (id: string) => setSigningId(id),
    closeSign: () => setSigningId(null),
    sign,
  };
}
