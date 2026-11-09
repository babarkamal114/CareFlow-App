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
} from 'sections';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export default function CompliancePage() {
  return (
    <div className="w-full min-w-0 p-0 md:p-6 bg-transparent">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-w-0 rounded-2xl bg-cf-surface shadow-cf-md p-3 space-y-3 sm:p-4 sm:space-y-4 md:p-6"
      >
        <motion.div variants={item} className="flex items-start justify-between gap-4 pb-4 border-b border-cf-border-light">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-cf-ink">
              Compliance
            </h1>
            <p className="mt-1 text-sm text-cf-ink-60">
              CQC readiness, audit trail, and inspection evidence
            </p>
          </div>
        </motion.div>
        <motion.div variants={item}>
          <CQCReadinessStats />
        </motion.div>
        <motion.div variants={item} className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-col gap-4 xl:flex-[65]">
            <CQCReadinessCard />
            <RecentAuditTrailCard />
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 xl:flex xl:w-[340px] xl:shrink-0 xl:flex-col">
            <ComplianceAlerts />
            <CQCInspectionPack />
          </div>
        </motion.div>
        <motion.div variants={item} className="grid gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          <div>
            <CQCScoreTrendCard />
          </div>
          <div>
            <DigitalSignaturesPanel />
          </div>
        </motion.div>
        <motion.div variants={item}>
          <KeyRegulationsCard />
        </motion.div>
      </motion.div>
    </div>
  );
}