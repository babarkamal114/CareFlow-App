'use client';

import { motion } from 'framer-motion';
import {
  ComplianceAlerts,
  CQCInspectionPack,
  KeyRegulationsCard,
  CQCReadinessCard,
  CQCReadinessStats,
  RecentAuditTrailCard,
  CQCScoreTrendCard,
  DigitalSignaturesPanel,
  SafeguardingModule,

} from 'sections';


const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
 
const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};
 
export default function CompliancePage() {
  return (
    <div className="w-full p-6 bg-transparent">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="rounded-2xl bg-cf-surface shadow-cf-md p-6 space-y-4"
      >
        {/* Heading */}
        <motion.div variants={item} className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
              Compliance
            </h1>
            <p className="mt-1 text-sm text-cf-ink-60">
              CQC readiness, audit trail, and inspection evidence
            </p>
          </div>
        </motion.div>
 
        {/* Row 1 — KPI stat cards */}
        <motion.div variants={item}>
          <CQCReadinessStats />
        </motion.div>
 
        {/* Row 2 — CQC Five Questions + Audit Trail | Alerts + Inspection Pack */}
        <motion.div variants={item} className="flex gap-4 items-start">
          <div className="flex flex-col flex-[65] min-w-0 gap-4">
            <CQCReadinessCard />
            <RecentAuditTrailCard />
          </div>
          <div className="flex flex-col w-[340px] shrink-0 gap-4">
            <ComplianceAlerts />
            <CQCInspectionPack />
          </div>
        </motion.div>
 
        {/* Row 3 — CQC Score Trend | Safeguarding (both tall, equal halves) */}
        <motion.div variants={item} className="flex gap-4 items-stretch">
          <div className="flex-1 min-w-0">
            <CQCScoreTrendCard />
          </div>
          <div className="flex-1 min-w-0">
            <SafeguardingModule />
          </div>
        </motion.div>
 
        {/* Row 4 — Key Regulations | Digital Signatures (both medium, equal halves) */}
        <motion.div variants={item} className="flex gap-4 items-stretch">
          <div className="flex-1 min-w-0">
            <KeyRegulationsCard />
          </div>
          <div className="flex-1 min-w-0">
            <DigitalSignaturesPanel />
          </div>
        </motion.div>
 
      </motion.div>
    </div>
  );
}
 