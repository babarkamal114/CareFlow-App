"use client";

import {
  ExportMenu,
  PnlSummaryCard,
  ProfitabilityTable,
  REPORT_EXPORT_OPTIONS,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import {
  mockAreaProfitability,
  mockCarerCosts,
  mockPatientProfitability,
  mockPnlMonths,
} from "lib";
import { useMemo } from "react";
import { getAreaCost, getCarerTotalCost, getMarginPct, getPatientCost } from "utils";
import { AREA_COLUMNS, CARER_COLUMNS, PATIENT_COLUMNS } from "@/components/ui";

const REPORT_TABS = [
  { id: "patients", label: "By patient", hint: "Lowest margin first, so loss-making patients are easy to spot." },
  { id: "areas", label: "By area", hint: "Compare areas by profit per visit and average travel time." },
  { id: "carers", label: "Carer cost", hint: "Total cost per carer (pay, travel, expenses) against revenue generated." },
  { id: "pnl", label: "Monthly P&L", hint: "Revenue, direct costs and gross margin. Export for your accountant." },
] as const;

interface FinanceReportsSectionProps {
  onExport: (label: string) => void;
}

/** Financial reporting (Blueprint 3.6.3). */
export function FinanceReportsSection({ onExport }: FinanceReportsSectionProps) {
  const patients = useMemo(
    () =>
      [...mockPatientProfitability].sort(
        (a, b) => getMarginPct(a.revenue, getPatientCost(a)) - getMarginPct(b.revenue, getPatientCost(b)),
      ),
    [],
  );
  const areas = useMemo(
    () =>
      [...mockAreaProfitability].sort(
        (a, b) => getMarginPct(a.revenue, getAreaCost(a)) - getMarginPct(b.revenue, getAreaCost(b)),
      ),
    [],
  );
  const carers = useMemo(
    () =>
      [...mockCarerCosts].sort(
        (a, b) =>
          getMarginPct(a.revenueGenerated, getCarerTotalCost(a)) -
          getMarginPct(b.revenueGenerated, getCarerTotalCost(b)),
      ),
    [],
  );

  const handleExport = (id: string) => {
    const label = REPORT_EXPORT_OPTIONS.find((o) => o.id === id)?.label ?? id;
    onExport(label);
  };

  return (
    <Tabs defaultValue="patients" className="gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          {REPORT_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="px-3">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <ExportMenu options={REPORT_EXPORT_OPTIONS} onSelect={handleExport} />
      </div>

      {REPORT_TABS.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-3">
          <p className="text-xs text-cf-ink-60">{tab.hint}</p>
          {tab.id === "patients" && (
            <ProfitabilityTable rows={patients} columns={PATIENT_COLUMNS} getRowKey={(r) => r.patientId} />
          )}
          {tab.id === "areas" && (
            <ProfitabilityTable rows={areas} columns={AREA_COLUMNS} getRowKey={(r) => r.area} />
          )}
          {tab.id === "carers" && (
            <ProfitabilityTable rows={carers} columns={CARER_COLUMNS} getRowKey={(r) => r.carerId} />
          )}
          {tab.id === "pnl" && <PnlSummaryCard months={mockPnlMonths} />}
        </TabsContent>
      ))}
    </Tabs>
  );
}