'use client';

import { Input } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { Search } from 'lucide-react';

interface CarePlanFilterToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'approved', label: 'Approved' },
  { id: 'in-review', label: 'In Review' },
  { id: 'draft', label: 'Draft' },
];

export function CarePlanFilterToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: CarePlanFilterToolbarProps) {
  return (
    <div className="border-b border-cf-border pb-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={onTabChange}>
            <TabsList className="bg-cf-surface-muted">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-cf-surface data-[state=active]:text-cf-ink data-[state=active]:shadow-none text-xs"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cf-ink-40" />
            <Input
              type="text"
              placeholder="Search by patient or title..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 w-full border-cf-border bg-cf-surface-muted pl-8 text-sm text-cf-ink placeholder:text-cf-ink-40 focus:border-cf-brand-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}