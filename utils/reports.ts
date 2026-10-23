import type {
  ReportBuilderConfig, ReportBuilderResult, ReportColumn, ReportColumnKind, ReportDataset, ReportKpi, ReportRole, ReportRow, ReportScheduleFrequency,
} from "types";

const gbp0 = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const gbp2 = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const round1 = (n: number) => Math.round(n * 10) / 10;

export function formatReportValue(value: string | number | undefined, kind: ReportColumnKind): string {
  if (value === undefined || value === "") return "—";
  if (typeof value === "string") {
    if (kind === "date") {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    }
    return value;
  }
  if (kind === "currency") return Number.isInteger(value) ? gbp0.format(value) : gbp2.format(value);
  if (kind === "percent") return `${round1(value)}%`;
  return value.toLocaleString("en-GB", { maximumFractionDigits: 1 });
}

// ---- KPIs ----
export function formatKpiValue(k: ReportKpi): string {
  if (k.unit === "currency") return gbp0.format(k.value);
  if (k.unit === "percent") return `${k.value}%`;
  return String(k.value);
}

export function getKpiChange(k: ReportKpi) {
  const delta = round1(k.value - k.previous);
  const pct = k.previous ? round1((delta / k.previous) * 100) : 0;
  const direction = delta === 0 ? "flat" : delta > 0 ? "up" : "down";
  const good = direction === "flat" ? true : k.higherIsBetter ? delta > 0 : delta < 0;
  return { delta, pct, direction, good } as const;
}

// ---- Role access ----
export const canViewDataset = (role: ReportRole, ds: ReportDataset): boolean => ds.roles.includes(role);

// ---- Schedules ----
function atTime(base: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, 0, 0);
}

export function computeReportNextRun(frequency: ReportScheduleFrequency, time: string, dayOfWeek: number | undefined, dayOfMonth: number | undefined, now: Date): Date {
  if (frequency === "daily") {
    const today = atTime(now, time);
    return today > now ? today : atTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), time);
  }
  if (frequency === "weekly") {
    const target = dayOfWeek ?? 1;
    for (let i = 0; i < 8; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const iso = d.getDay() === 0 ? 7 : d.getDay();
      if (iso === target && atTime(d, time) > now) return atTime(d, time);
    }
  }
  const day = dayOfMonth ?? 1;
  const thisMonth = atTime(new Date(now.getFullYear(), now.getMonth(), day), time);
  return thisMonth > now ? thisMonth : atTime(new Date(now.getFullYear(), now.getMonth() + 1, day), time);
}

export const formatReportRun = (d: Date): string =>
  `${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

// ---- Custom report builder ----
const NUMERIC: ReportColumnKind[] = ["number", "percent", "currency"];
export const isReportNumericColumn = (c: ReportColumn): boolean => NUMERIC.includes(c.kind);

export function runCustomReport(ds: ReportDataset, config: ReportBuilderConfig): ReportBuilderResult {
  const dateCol = ds.columns.find((c) => c.dateKey);
  let rows: ReportRow[] = ds.rows;
  if (dateCol && (config.from || config.to)) {
    rows = rows.filter((r) => {
      const v = String(r[dateCol.key]);
      return (!config.from || v >= config.from) && (!config.to || v <= config.to);
    });
  }
  const selected = config.fields.map((k) => ds.columns.find((c) => c.key === k)).filter((c): c is ReportColumn => Boolean(c));

  let columns: ReportColumn[];
  let out: ReportRow[];
  const groupCol = config.groupBy ? ds.columns.find((c) => c.key === config.groupBy) : undefined;

  if (groupCol) {
    const measures = selected.filter((c) => isReportNumericColumn(c) && c.key !== groupCol.key);
    const groups = new Map<string, ReportRow[]>();
    rows.forEach((r) => groups.set(String(r[groupCol.key]), [...(groups.get(String(r[groupCol.key])) ?? []), r]));
    if (config.aggregate === "count" || measures.length === 0) {
      columns = [groupCol, { key: "count", label: "Count", kind: "number" }];
      out = [...groups].map(([g, list]) => ({ [groupCol.key]: g, count: list.length }));
    } else {
      columns = [groupCol, ...measures.map((m) => ({ ...m, label: `${config.aggregate === "sum" ? "Total" : "Average"} ${m.label.toLowerCase()}` }))];
      out = [...groups].map(([g, list]) => {
        const row: ReportRow = { [groupCol.key]: g };
        measures.forEach((m) => {
          const sum = list.reduce((s, r) => s + Number(r[m.key] ?? 0), 0);
          row[m.key] = round1(config.aggregate === "sum" ? sum : sum / list.length);
        });
        return row;
      });
    }
  } else {
    columns = selected;
    out = rows.map((r) => Object.fromEntries(selected.map((c) => [c.key, r[c.key]])));
  }

  const numeric = columns.filter(isReportNumericColumn);
  const x = columns.find((c) => !isReportNumericColumn(c)) ?? columns[0];
  const chartKind = config.chart === "table" || numeric.length === 0 || !x ? "table" : config.chart;
  return { columns, rows: out, chart: { kind: chartKind, xKey: x?.key ?? "", yKeys: chartKind === "donut" ? numeric.slice(0, 1).map((c) => c.key) : numeric.slice(0, 3).map((c) => c.key) } };
}

export const REPORT_DEFAULT_BUILDER_CONFIG: ReportBuilderConfig = { datasetId: "", fields: [], groupBy: "", aggregate: "sum", chart: "bar", from: "", to: "" };

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;

export function describeReportSchedule(s: { frequency: ReportScheduleFrequency; time: string; dayOfWeek?: number; dayOfMonth?: number }): string {
  if (s.frequency === "weekly") return `Weekly on ${WEEKDAYS[(s.dayOfWeek ?? 1) - 1]} at ${s.time}`;
  if (s.frequency === "monthly") return `Monthly on the ${ordinal(s.dayOfMonth ?? 1)} at ${s.time}`;
  return `Daily at ${s.time}`;
}

export function parseReportDate(value: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : undefined;
}
