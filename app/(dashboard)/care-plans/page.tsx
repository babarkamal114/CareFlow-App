'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  CarePlanAiSuggestions,
  CarePlanBlocksSection,
  CarePlanCreationModal,
  CarePlanFilterToolbar,
  CarePlanHeader,
  CarePlanReviewQueue,
  CarePlanStatSection,
} from "sections";
import type { CarePlan, ModuleCreationData } from "types";
import { mockCarePlan, mockModules } from "utils";
import { Separator } from "@/components/ui";

const mockCarePlansList: CarePlan[] = [
    mockCarePlan,
    {
        ...mockCarePlan,
        id: 'cp-2024-002',
        patientId: 'P-12346',
        patientName: 'James Okafor',
        patientDOB: '1955-08-22',
        patientAddress: '45 Maple Road, London',
        keyWorker: 'Michael Chen',
        modules: [mockModules.medication, mockModules.mobility],
        overallStatus: 'approved',
        lastReviewDate: '2024-02-15',
        nextReviewDate: '2024-03-14',
    },
    {
        ...mockCarePlan,
        id: 'cp-2024-003',
        patientId: 'P-12347',
        patientName: 'Edna Morris',
        patientDOB: '1938-11-05',
        patientAddress: '88 Oak Street, London',
        keyWorker: 'Emma Williams',
        modules: [mockModules.nutrition, mockModules.dementia, mockModules.personalCare],
        overallStatus: 'in-review',
        lastReviewDate: '2024-03-01',
        nextReviewDate: '2024-03-29',
    },
    {
        ...mockCarePlan,
        id: 'cp-2024-004',
        patientId: 'P-12348',
        patientName: 'Robert Hayes',
        patientDOB: '1948-03-12',
        patientAddress: '12 Pine Avenue, London',
        keyWorker: 'David Smith',
        modules: [mockModules.mobility, mockModules.personalCare],
        overallStatus: 'draft',
        lastReviewDate: '2024-03-12',
        nextReviewDate: '2024-02-09',
    }
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function Page() {
    const [activeFilterTab, setActiveFilterTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [carePlans, setCarePlans] = useState<CarePlan[]>(mockCarePlansList);

    const patientNames = carePlans.reduce<Record<string, string>>((acc, plan) => {
        acc[plan.patientId] = plan.patientName;
        return acc;
    }, {});

    const handleAddNewPlan = () => {
        setIsCreationModalOpen(true);
    };

    const handleCreationComplete = (data: ModuleCreationData) => {
        const newCarePlan: CarePlan = {
            id: `cp-${Date.now()}`,
            patientId: data.patientId || `P-${Date.now()}`,
            patientName: 'New Patient',
            patientDOB: '1970-01-01',
            patientAddress: '123 New St',
            keyWorker: data.createdBy || 'Unknown',
            keyWorkerContact: '',
            modules: [{
                id: `mod-${Date.now()}`,
                name: data.name,
                type: data.type,
                status: data.status,
                reviewStatus: data.reviewStatus,
                version: data.version || 'v1.0',
                createdDate: new Date().toISOString().split('T')[0],
                reviewDate: new Date().toISOString().split('T')[0],
                nextReviewDate: new Date().toISOString().split('T')[0],
                createdBy: data.createdBy,
                lastReviewedBy: data.createdBy,
                content: data.content
            }],
            overallStatus: 'draft',
            createdDate: new Date().toISOString().split('T')[0],
            lastReviewDate: new Date().toISOString().split('T')[0],
            nextReviewDate: new Date().toISOString().split('T')[0],
            createdBy: data.createdBy,
        };

        setCarePlans(prev => [newCarePlan, ...prev]);

        toast.success(`Care Plan created successfully!`, {
            description: `Added "${data.name}" to vault`,
        });

        setIsCreationModalOpen(false);
    };

    return (
        <div className="w-full min-w-0 p-0 md:p-6 bg-transparent">
            <motion.div
                initial="hidden"
                animate="show"
                variants={container}
                className="min-w-0 rounded-2xl bg-cf-surface shadow-cf-md p-3 space-y-3 sm:p-4 sm:space-y-4 md:p-6"
            >
                <motion.div variants={item}>
                    <CarePlanHeader onCreateNew={handleAddNewPlan} />
                </motion.div>

                <motion.div variants={item}>
                    <CarePlanStatSection />
                </motion.div>

                <motion.div variants={item}>
                    <CarePlanFilterToolbar
                        activeTab={activeFilterTab}
                        onTabChange={setActiveFilterTab}
                        onSearchChange={setSearchQuery}
                        searchQuery={searchQuery}
                    />
                </motion.div>
                <motion.div variants={item} className='flex w-full flex-col gap-4 xl:flex-row xl:items-start'>
                    <div className="flex flex-col gap-y-4 w-full min-w-0 xl:flex-1">
                        <CarePlanBlocksSection
                            carePlans={carePlans}
                            filterTab={activeFilterTab}
                            searchQuery={searchQuery}
                        />
                        <CarePlanAiSuggestions patientNames={patientNames} orientation="horizontal" />
                    </div>
                    <div className="w-full xl:max-w-sm xl:shrink-0">
                        <CarePlanReviewQueue />
                    </div>
                </motion.div>

                <CarePlanCreationModal
                    open={isCreationModalOpen}
                    onOpenChange={setIsCreationModalOpen}
                    onComplete={handleCreationComplete}
                />
            </motion.div>
        </div>
    );
}

export default Page;