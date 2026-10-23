"use client";

import { Badge, EmptyState, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useAiInsights } from "hooks";
import { Scale } from "lucide-react";
import { useState } from "react";
import type { ReportDomain, ReportRole, ReportTabId } from "types";
import { REPORT_TABS } from "utils";
import { ReportsDomainPanel } from "./ReportsDomainPanel";
import { ReportsInsightsSection } from "./ReportsInsightsSection";
import { ReportsSectionHeading } from "./ReportsSectionHeading";

const DOMAINS: ReportDomain[] = ["compliance", "clinical", "workforce", "finance", "operations"];

interface ReportsDashboardSectionProps { role: ReportRole; tabs: typeof REPORT_TABS }

/** Dashboards (Blueprint 5.6 layout, item 2): one tab per area. Tabs a role cannot see are not shown at all. */
export function ReportsDashboardSection({ role, tabs }: ReportsDashboardSectionProps) {
  const [tab, setTab] = useState<ReportTabId>("compliance");
  const insights = useAiInsights();
  const active = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;
  if (!active) return null;

  return (
    <section className="space-y-3">
      <ReportsSectionHeading title="Dashboards" description="Live charts and tables by area. Export any widget as PDF, Excel or CSV." />
      <Tabs value={active} onValueChange={(v) => setTab(v as ReportTabId)} className="gap-4">
        <TabsList variant="line" className="w-full justify-start border-b border-cf-border-light pb-1">
          {tabs.map(({ id, label, Icon }) => (
            <TabsTrigger key={id} value={id} className="flex-none px-3">
              <Icon />{label}
              {id === "ai-insights" && insights.openCount > 0 && <Badge variant="softInfo" shape="pill" badgeSize="sm">{insights.openCount}</Badge>}
              {id === "benchmarking" && <Badge variant="softMuted" shape="pill" badgeSize="sm">Soon</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>

        {DOMAINS.filter((d) => tabs.some((t) => t.id === d)).map((d) => (
          <TabsContent key={d} value={d}><ReportsDomainPanel domain={d} role={role} /></TabsContent>
        ))}
        {tabs.some((t) => t.id === "ai-insights") && <TabsContent value="ai-insights"><ReportsInsightsSection /></TabsContent>}
        {tabs.some((t) => t.id === "benchmarking") && (
          <TabsContent value="benchmarking">
            <EmptyState icon={<Scale />} title="Benchmarking is coming in Phase 3" description="Compare your agency's performance against the anonymised CareFlow network average." />
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
