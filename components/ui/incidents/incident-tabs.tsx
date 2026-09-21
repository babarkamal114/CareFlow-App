'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Incident } from '@/types';
import { IncidentInfoTab } from './incident-info-tab';
import { IncidentLogsTab } from './incident-logs-tab';
import { IncidentEvidenceTab } from './incident-evidence-tab';


interface IncidentTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  incident: Incident;
}

const TABS = [
  { value: 'info', label: 'Info' },
  { value: 'logs', label: 'Logs' },
  { value: 'evidence', label: 'Evidence' },
];

export function IncidentTabs({
  selectedTab,
  onTabChange,
  incident,
}: IncidentTabsProps) {

  const evidenceCount = 0;

  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full h-full">
      <div className="border-b border-cf-border px-6">
        <TabsList className="w-auto justify-start rounded-none bg-transparent">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:border-b-2 data-[state=active]:border-brand-500 rounded-none"
            >
              {tab.label}
              {tab.value === 'evidence' ? ` (${evidenceCount})` : ''}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="info" className="p-6">
        <IncidentInfoTab incident={incident} />
      </TabsContent>
      <TabsContent value="logs" className="p-6">
        <IncidentLogsTab incident={incident} />
      </TabsContent>
      <TabsContent value="evidence" className="p-6">
        <IncidentEvidenceTab />
      </TabsContent>
    </Tabs>
  );
}