"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PatientsFilterToolbarSection,
  PatientsTable,
  PatientDrawer,
  PatientStatSection,
  PatientsPageHeader,
  CreatePatientModal,
  EditPatientModal,
  EditMedicationModal,
  type Medication,
} from "sections";
import { mockPatients } from "utils";
import type { Patient } from "types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<
    "active" | "on-hold" | "high-risk" | "review-date" | "new" | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patientsData, setPatientsData] = useState<Patient[]>(mockPatients);
  const [createModal, setCreateModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);
  const [patientMeds, setPatientMeds] = useState<Medication[]>([]);

  const handleEditMedications = (medications: Medication[]) => {
    setPatientMeds(medications);
    setMedicationModalOpen(true);
  };

  const handleSaveMedications = async (medications: Medication[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPatientsData((prev) =>
      prev.map((p) =>
        p.id === selectedPatient?.id ? { ...p, medications } : p,
      ),
    );
    console.log("Medications updated:", medications);
  };

  const handlePatientCreate = (newPatient: Patient) => {
    setPatientsData((prev) => [...prev, newPatient]);
    console.log("New patient created:", newPatient);
  };

  const handlePatientUpdate = async (data: Partial<Patient>) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPatientsData((prev) =>
      prev.map((p) => (p.id === selectedPatient?.id ? { ...p, ...data } : p)),
    );
    console.log("Patient updated:", { id: selectedPatient?.id, ...data });
  };

  const handleDischargePatient = async (patientId: string, payload: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPatientsData((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: "discharged" as const, dischargeDetails: payload }
          : p,
      ),
    );
    console.log("Patient discharged:", { id: patientId, ...payload });
  };

  const filteredPatients = useMemo(() => {
    let result = [...patientsData];

    if (activeTab === "active") {
      result = result.filter((p) => p.status === "active");
    } else if (activeTab === "on-hold") {
      result = result.filter((p) => p.status === "on-hold");
    } else if (activeTab === "new") {
      result = result.filter((p) => p.status === "new");
    } else if (activeTab === "high-risk") {
      result = result.filter((p) => p.risk === "high");
    } else if (activeTab === "review-date") {
      result = result.filter((p) => {
        const today = new Date();
        const nextVisitDate = new Date(p.nextVisit);
        const diffTime = nextVisitDate.getTime() - today.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query),
      );
    }

    return result;
  }, [patientsData, activeTab, searchQuery]);

  const handleExportClick = () => {
    console.log("Export patients");
  };

  const handleFilterClick = () => {
    console.log("something clicked");
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDrawerOpen(true);
  };

  const handleCreatePatient = () => {
    setCreateModal(true);
  };

  return (
    <div className="w-full p-6 bg-transparent">
      {/* One white rounded panel holding the heading and everything below
          it — same structure as Dashboard/Staff. No overflow here: the
          shell's <main> is the only scroll container, avoiding a second
          scrollbar. */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="rounded-2xl bg-cf-surface shadow-cf-md p-6 space-y-4"
      >
        <motion.div variants={item}>
          <PatientsPageHeader onCreateClick={handleCreatePatient} />
        </motion.div>

        <CreatePatientModal
          open={createModal}
          onOpenChange={setCreateModal}
          onPatientCreate={handlePatientCreate}
        />

        <EditPatientModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          patient={selectedPatient}
          onSave={handlePatientUpdate}
        />
        <EditMedicationModal
          open={medicationModalOpen}
          onOpenChange={setMedicationModalOpen}
          medications={patientMeds}
          onSave={handleSaveMedications}
          patientName={selectedPatient?.name}
        />

        <motion.div variants={item}>
          <PatientStatSection />
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-y-1">
          <PatientsFilterToolbarSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onFilterClick={handleFilterClick}
            onExportClick={handleExportClick}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <PatientsTable patients={filteredPatients} onView={handleViewPatient} />
        </motion.div>

        <PatientDrawer
          patient={selectedPatient}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onEditPatient={setEditModalOpen as any}
          onUpdateMeds={handleEditMedications as any}
          onDischarge={handleDischargePatient}
        />
      </motion.div>
    </div>
  );
}