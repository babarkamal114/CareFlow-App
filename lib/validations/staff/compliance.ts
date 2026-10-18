import { z } from "zod";
import { isExpired } from "./compliance-status";
import { EMAIL_REGEX, UK_PHONE_REGEX, requiredText } from "./helpers";

const MIN_REFEREES = 2;

const RTW_CHECK_TYPE_VALUES = ["online", "digital_dvsp", "manual"] as const;

const DBS_PATH_VALUES = ["new_application", "existing_certificate"] as const;

const DBS_STATUS_VALUES = [
  "pending",
  "temporarily_verified",
  "clear",
  "flagged_for_review",
] as const;

const TRAVEL_MODE_VALUES = [
  "drive",
  "public_transport",
  "cycle",
  "walk",
] as const;

const REFEREE_RELATIONSHIP_VALUES = [
  "manager",
  "hr",
  "colleague",
  "other",
] as const;

const PASSPORT_DOCUMENT_TYPE = "passport";

const rightToWorkSchema = z.object({
  checkType: z.union([z.literal(""), z.enum(RTW_CHECK_TYPE_VALUES)]).superRefine(
    (value, ctx) => {
      if (value === "") {
        ctx.addIssue({
          code: "custom",
          message: "Right to work check type is required",
        });
      }
    }
  ),
  checkDate: requiredText("Right to work check date"),
  documentType: requiredText("Document type"),
  documentExpiryDate: z.string().optional(),
});

const interimCertificateSchema = z.object({
  certificateNumber: requiredText("Certificate number"),
  issueDate: requiredText("Issue date"),
  statusCheckDate: requiredText("Status check date"),
  updateServiceConsent: z.literal(true, {
    error: "Consent to share with the update service is required",
  }),
  originalSeenInPerson: z.boolean(),
  statusCheckResult: z.literal("current"),
});

const dbsSchema = z.object({
  path: z.union([z.literal(""), z.enum(DBS_PATH_VALUES)]).superRefine(
    (value, ctx) => {
      if (value === "") {
        ctx.addIssue({ code: "custom", message: "DBS route is required" });
      }
    }
  ),
  applicationReference: z.string().optional(),
  submittedDate: z.string().optional(),
  interimCertificate: interimCertificateSchema.optional(),
  status: z.union([z.literal(""), z.enum(DBS_STATUS_VALUES)]).superRefine(
    (value, ctx) => {
      if (value === "") {
        ctx.addIssue({ code: "custom", message: "DBS status is required" });
      }
    }
  ),
  expiryDate: z.string(),
});

const drivingSchema = z.object({
  hasLicence: z.boolean(),
  licenceNumber: z.string().optional(),
  drivesForWork: z.boolean(),
  travelMode: z.union([z.literal(""), z.enum(TRAVEL_MODE_VALUES)]),
});

const refereeSchema = z.object({
  name: requiredText("Name"),
  role: requiredText("Role"),
  organisation: requiredText("Organisation"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(UK_PHONE_REGEX, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .regex(EMAIL_REGEX, "Enter a valid email address"),
  relationship: z.enum(REFEREE_RELATIONSHIP_VALUES),
  referenceReceived: z.literal(true, {
    error: "Mark the reference as received before continuing",
  }),
});

export const complianceStepSchema = z
  .object({
    rightToWork: rightToWorkSchema,
    dbs: dbsSchema,
    driving: drivingSchema,
    referees: z.array(refereeSchema).min(MIN_REFEREES, {
      error: `At least ${MIN_REFEREES} referees are required`,
    }),
  })
  .superRefine((data, ctx) => {
    validateDocumentExpiry(data, ctx);
    validateDbsRoute(data, ctx);
    validateInterimCertificate(data, ctx);
    validateDriving(data, ctx);
  });

type ComplianceStep = z.infer<typeof complianceStepSchema>;

function validateDocumentExpiry(
  data: ComplianceStep,
  ctx: z.RefinementCtx
) {
  const { documentType, documentExpiryDate } = data.rightToWork;

  if (documentType !== PASSPORT_DOCUMENT_TYPE) return;

  if (!documentExpiryDate) {
    ctx.addIssue({
      code: "custom",
      path: ["rightToWork", "documentExpiryDate"],
      message: "Document expiry date is required",
    });
    return;
  }

  if (isExpired(documentExpiryDate)) {
    ctx.addIssue({
      code: "custom",
      path: ["rightToWork", "documentExpiryDate"],
      message: "This document has expired and must be re-checked",
    });
  }
}

function validateDbsRoute(data: ComplianceStep, ctx: z.RefinementCtx) {
  const { path, applicationReference, submittedDate, expiryDate } = data.dbs;

  if (path === "new_application") {
    if (!applicationReference) {
      ctx.addIssue({
        code: "custom",
        path: ["dbs", "applicationReference"],
        message: "Application reference is required",
      });
    }
    if (!submittedDate) {
      ctx.addIssue({
        code: "custom",
        path: ["dbs", "submittedDate"],
        message: "Submitted date is required",
      });
    }
  }

  if (path !== "existing_certificate") return;

  if (!expiryDate) {
    ctx.addIssue({
      code: "custom",
      path: ["dbs", "expiryDate"],
      message: "DBS expiry date is required",
    });
    return;
  }

  if (isExpired(expiryDate)) {
    ctx.addIssue({
      code: "custom",
      path: ["dbs", "expiryDate"],
      message: "This DBS certificate has expired",
    });
  }
}

function validateInterimCertificate(
  data: ComplianceStep,
  ctx: z.RefinementCtx
) {
  const { status, interimCertificate } = data.dbs;

  if (status !== "temporarily_verified") return;

  if (!interimCertificate) {
    ctx.addIssue({
      code: "custom",
      path: ["dbs", "interimCertificate"],
      message:
        "Interim certificate details are required for a temporarily verified status",
    });
  }
}

function validateDriving(data: ComplianceStep, ctx: z.RefinementCtx) {
  const { hasLicence, licenceNumber, travelMode } = data.driving;

  if (hasLicence && !licenceNumber) {
    ctx.addIssue({
      code: "custom",
      path: ["driving", "licenceNumber"],
      message: "Licence number is required",
    });
  }

  if (hasLicence && !travelMode) {
    ctx.addIssue({
      code: "custom",
      path: ["driving", "travelMode"],
      message: "Travel mode is required",
    });
  }
}