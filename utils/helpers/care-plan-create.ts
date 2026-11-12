import type { CarePlan, ModuleCreationData } from "types";
import { getMockPatientById } from "../data/patients";

export function buildCarePlanFromCreation(data: ModuleCreationData): CarePlan {
  const today = new Date().toISOString().split("T")[0];
  const patient = data.patientId ? getMockPatientById(data.patientId) : undefined;

  return {
    id: `cp-${Date.now()}`,
    patientId: data.patientId || `P-${Date.now()}`,
    patientName: patient?.name ?? "New Patient",
    patientDOB: patient?.dateOfBirth ?? "1970-01-01",
    patientAddress: patient?.address ?? "123 New St",
    keyWorker: data.createdBy || "Unknown",
    keyWorkerContact: "",
    modules: [
      {
        id: `mod-${Date.now()}`,
        name: data.name,
        type: data.type,
        status: data.status,
        reviewStatus: data.reviewStatus,
        version: data.version || "v1.0",
        createdDate: today,
        reviewDate: today,
        nextReviewDate: today,
        createdBy: data.createdBy,
        lastReviewedBy: data.createdBy,
        content: data.content,
      },
    ],
    overallStatus: "draft",
    createdDate: today,
    lastReviewDate: today,
    nextReviewDate: today,
    createdBy: data.createdBy,
  };
}