// components/sections/patients/PatientsFilterToolbarSection.tsx
'use client';

import { Button } from "@/components/ui";
import { Download, Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { Input } from "@/components/ui";

type PatientTab = 'active' | 'on-hold' | 'high-risk' | 'review-date' | 'new' | 'all';

interface PatientsFilterToolbarSectionProps {
  onTabChange: (tab: PatientTab) => void;
  onFilterClick: () => void;
  onExportClick: () => void;
  activeTab: PatientTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const tabs: Array<{ id: PatientTab; label: string; count?: number }> = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active', count: 45 },
  { id: 'on-hold', label: 'On Hold', count: 8 },
  { id: 'high-risk', label: 'High Risk', count: 12 },
  { id: 'review-date', label: 'Review Date', count: 5 },
  { id: 'new', label: 'New', count: 3 },
];

export function PatientsFilterToolbarSection({
  onTabChange,
  onFilterClick,
  onExportClick,
  activeTab,
  searchQuery,
  onSearchChange,
}: PatientsFilterToolbarSectionProps) {
  return (
    <div className="">
      <div className="flex items-center justify-between gap-6">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as PatientTab)} className="flex-1">
          <TabsList className="bg-cf-surface-muted">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-cf-surface data-[state=active]:text-cf-ink data-[state=active]:shadow-none text-xs"
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 text-[10px] opacity-70">({tab.count})</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cf-ink-40" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 w-full border-cf-border bg-cf-surface-muted pl-8 text-sm text-cf-ink placeholder:text-cf-ink-40 focus:border-cf-brand-300"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportClick}
            
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
}