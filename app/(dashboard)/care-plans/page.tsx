'use client'

import { useState } from 'react';
import { toast } from 'sonner';
import {
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

function Page() {
    const [activeFilterTab, setActiveFilterTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [carePlans, setCarePlans] = useState<CarePlan[]>(mockCarePlansList);

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
        <div className="h-screen w-full  space-y-8 overflow-y-scroll no-scrollbar">
            <CarePlanHeader 
                onCreateNew={handleAddNewPlan}
            />
            <Separator />
            <CarePlanStatSection />
            <CarePlanFilterToolbar 
                activeTab={activeFilterTab}
                onTabChange={setActiveFilterTab}
                onSearchChange={setSearchQuery}
                searchQuery={searchQuery}
            />
            <div className='flex w-full gap-x-4'> 
                <CarePlanBlocksSection 
                    carePlans={carePlans}
                    filterTab={activeFilterTab}
                    searchQuery={searchQuery}
                />
                <CarePlanReviewQueue />
            </div>

            <CarePlanCreationModal
                open={isCreationModalOpen}
                onOpenChange={setIsCreationModalOpen}
                onComplete={handleCreationComplete}
            />
        </div>
    );
}

export default Page;