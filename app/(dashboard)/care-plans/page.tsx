'use client'

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  CarePlanAiSuggestions,
  CarePlanBlocksSection,
  CarePlanCreationModal,
  CarePlanDeepLink,
  CarePlanFilterToolbar,
  CarePlanHeader,
  CarePlanReviewQueue,
  CarePlanStatSection,
} from "sections";
import { useCarePlans } from "hooks";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function Page() {
    const cp = useCarePlans();

    return (
        <div className="w-full p-6 bg-transparent">
            <Suspense fallback={null}>
                <CarePlanDeepLink onAddCarePlan={cp.openCreateForPatient} />
            </Suspense>

            <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="rounded-2xl bg-cf-surface shadow-cf-md p-6 space-y-4"
            >
                <motion.div variants={item}>
                    <CarePlanHeader onCreateNew={cp.openCreate} />
                </motion.div>

                <motion.div variants={item}>
                    <CarePlanStatSection />
                </motion.div>

                <motion.div variants={item}>
                    <CarePlanFilterToolbar
                        activeTab={cp.activeFilterTab}
                        onTabChange={cp.setActiveFilterTab}
                        onSearchChange={cp.setSearchQuery}
                        searchQuery={cp.searchQuery}
                    />
                </motion.div>
                <motion.div variants={item} className='flex w-full gap-x-4 items-start'>
                    <div className="flex flex-col gap-y-4 flex-1 min-w-0">
                        <CarePlanBlocksSection
                            carePlans={cp.carePlans}
                            filterTab={cp.activeFilterTab}
                            searchQuery={cp.searchQuery}
                        />
                        <CarePlanAiSuggestions patientNames={cp.patientNames} orientation="horizontal" />
                    </div>
                    <div className="w-full max-w-sm shrink-0">
                        <CarePlanReviewQueue />
                    </div>
                </motion.div>

                <CarePlanCreationModal
                    open={cp.isCreationModalOpen}
                    onOpenChange={cp.onCreationOpenChange}
                    patientId={cp.creationPatientId}
                    patientName={cp.creationPatientName}
                    onComplete={cp.handleCreationComplete}
                />
            </motion.div>
        </div>
    );
}

export default Page;