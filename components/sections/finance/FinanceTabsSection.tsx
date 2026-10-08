"use client";

import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { BarChart3, CreditCard, FileText, LayoutDashboard, Tag } from "lucide-react";
import type { FinanceWorkspace } from "lib";
import { FinanceInvoicesSection } from "./FinanceInvoicesSection";
import { FinanceOverviewSection } from "./FinanceOverviewSection";
import { FinancePaymentsSection } from "./FinancePaymentsSection";
import { FinanceRatesSection } from "./FinanceRatesSection";
import { FinanceReportsSection } from "./FinanceReportsSection";

const TABS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "invoices", label: "Invoices", Icon: FileText },
  { id: "payments", label: "Payments", Icon: CreditCard },
  { id: "rates", label: "Rates", Icon: Tag },
  { id: "reports", label: "Reports", Icon: BarChart3 },
] as const;

export function FinanceTabsSection({ workspace: w }: { workspace: FinanceWorkspace }) {
  return (
    <Tabs defaultValue="overview" className="gap-4">
      <TabsList variant="line" className="w-full justify-start border-b border-cf-border-light pb-1">
        {TABS.map(({ id, label, Icon }) => (
          <TabsTrigger key={id} value={id} className="flex-none px-3">
            <Icon />
            {label}
            {id === "invoices" && (
              <Badge variant="softMuted" shape="pill" badgeSize="sm">{w.statusCounts.all}</Badge>
            )}
            {id === "payments" && w.overdueInvoices.length > 0 && (
              <Badge variant="softDanger" shape="pill" badgeSize="sm">{w.overdueInvoices.length}</Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview">
        <FinanceOverviewSection trend={w.trend} byFunding={w.byFunding} />
      </TabsContent>
      <TabsContent value="invoices">
        <FinanceInvoicesSection
          invoices={w.invoices}
          asOf={w.asOf}
          onView={w.openDetail}
          onRecordPayment={w.openPayment}
          onSendInvoices={w.sendInvoices}
          onExport={w.exportData}
        />
      </TabsContent>
      <TabsContent value="payments">
        <FinancePaymentsSection
          payments={w.payments}
          overdueInvoices={w.overdueInvoices}
          onSendReminders={() => w.setReminderOpen(true)}
        />
      </TabsContent>
      <TabsContent value="rates">
        <FinanceRatesSection rates={w.rates} onAdd={() => w.openRateDialog(null)} onEdit={w.openRateDialog} />
      </TabsContent>
      <TabsContent value="reports">
        <FinanceReportsSection onExport={w.exportData} />
      </TabsContent>
    </Tabs>
  );
}