'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { FileText, Paperclip, Info } from 'lucide-react';
import { Incident } from '@/types';
import { IncidentInfoTab } from './incident-info-tab';
import { IncidentLogsTab } from './incident-logs-tab';
import { IncidentEvidenceTab } from './incident-evidence-tab';


interface IncidentTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  incident: Incident;
}

export function IncidentTabs({
  selectedTab,
  onTabChange,
  incident,
}: IncidentTabsProps) {

  const evidenceCount = 0;

  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Info
        </TabsTrigger>
        <TabsTrigger value="logs" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Logs
        </TabsTrigger>
        <TabsTrigger value="evidence" className="flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Evidence ({evidenceCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-4">
        <IncidentInfoTab incident={incident} />
      </TabsContent>
      <TabsContent value="logs" className="mt-4">
        <IncidentLogsTab incident={incident} />
      </TabsContent>
      <TabsContent value="evidence" className="mt-4">
        <IncidentEvidenceTab />
      </TabsContent>
    </Tabs>
  );
}