"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { FundingSplitBar, RevenueChart } from "@/components/ui";
import type { MonthlyRevenuePoint, RevenueByFunding } from "types";

interface FinanceOverviewSectionProps {
  trend: MonthlyRevenuePoint[];
  byFunding: RevenueByFunding[];
}

/** Revenue dashboard (Blueprint 3.6.2): invoiced vs collected, broken down by funding source. */
export function FinanceOverviewSection({ trend, byFunding }: FinanceOverviewSectionProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="rounded-2xl border-cf-border-light shadow-cf-sm lg:col-span-3">
        <CardHeader>
          <CardTitle className="font-bold text-cf-ink">Invoiced vs collected</CardTitle>
          <p className="text-sm text-cf-ink-60">Last 6 months</p>
        </CardHeader>
        <CardContent>
          <RevenueChart data={trend} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-cf-border-light shadow-cf-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-bold text-cf-ink">Revenue by funding source</CardTitle>
          <p className="text-sm text-cf-ink-60">Invoiced to date</p>
        </CardHeader>
        <CardContent>
          <FundingSplitBar data={byFunding} />
        </CardContent>
      </Card>
    </div>
  );
}