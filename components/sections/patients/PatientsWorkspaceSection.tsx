'use client';

import { motion } from "framer-motion";
import { PatientsTable } from "@/components/ui";
import { usePatientsWorkspace } from "hooks";
import { PatientsFilterToolbarSection } from "./PatientsFilterToolbarSection";
import { PatientsPageHeader } from "./PatientsPageHeader";
import { PatientsStatsSection } from "./PatientsStatsSection";
import { CreatePatientModal } from "./patient-create-modal/PatientCreateModal";
import { PatientDrawer } from "./patient-drawer/PatientDrawer";
import { EditPatientModal } from "./patient-drawer/PatientEditModal";
import { EditMedicationModal } from "./patient-drawer/PatientUpdateMedsModal";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/** The whole Patients page body: header, stats, filters, table, drawer and modals. */
export function PatientsWorkspaceSection() {
  const workspace = usePatientsWorkspace();
  const { selectedPatient } = workspace;

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="space-y-4">
      <motion.div variants={item}>
        <PatientsPageHeader onCreateClick={() => workspace.setCreateOpen(true)} />
      </motion.div>

      <motion.div variants={item}>
        <PatientsStatsSection stats={workspace.stats} />
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-y-1">
        <PatientsFilterToolbarSection
          activeTab={workspace.activeTab}
          onTabChange={workspace.setActiveTab}
          onExportClick={workspace.exportPatients}
          searchQuery={workspace.searchQuery}
          onSearchChange={workspace.setSearchQuery}
          tabCounts={workspace.tabCounts}
        />
        <PatientsTable
          patients={workspace.filteredPatients}
          hasFilters={workspace.hasFilters}
          onView={workspace.viewPatient}
        />
      </motion.div>

      <CreatePatientModal
        open={workspace.createOpen}
        onOpenChange={workspace.setCreateOpen}
        onPatientCreate={workspace.createPatient}
      />

      <EditPatientModal
        open={workspace.editOpen}
        onOpenChange={workspace.setEditOpen}
        patient={selectedPatient}
        onSave={workspace.updatePatient}
      />

      <EditMedicationModal
        open={workspace.medicationsOpen}
        onOpenChange={workspace.setMedicationsOpen}
        medications={workspace.selectedMedications}
        onSave={workspace.saveMedications}
        patientName={selectedPatient?.name}
      />

      <PatientDrawer
        patient={selectedPatient}
        medications={workspace.selectedMedications}
        open={workspace.drawerOpen}
        onOpenChange={workspace.setDrawerOpen}
        onEditPatient={() => workspace.setEditOpen(true)}
        onUpdateMeds={() => workspace.setMedicationsOpen(true)}
        onDischarge={workspace.dischargePatient}
      />
    </motion.div>
  );
}