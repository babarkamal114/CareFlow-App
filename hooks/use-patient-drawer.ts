"use client";

import { useEffect, useState } from "react";

export function usePatientDrawer(open: boolean, patientId?: string) {
  const [activeTab, setActiveTab] = useState('info');
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  useEffect(() => {
    if (open) {
      setActiveTab('info');
      setDischargeModalOpen(false);
    }
  }, [open, patientId]);

  return { activeTab, setActiveTab, dischargeModalOpen, setDischargeModalOpen };
}