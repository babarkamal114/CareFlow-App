import type { ReportDataset, ReportExportFormat } from "types";
import { formatReportValue } from "./reports";

const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
const escHtml = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cell = (ds: ReportDataset, key: string, kind: ReportDataset["columns"][number]["kind"], row: ReportDataset["rows"][number]) => formatReportValue(row[key], kind);

export function downloadReportFile(filename: string, content: string, mime: string): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const buildReportCsv = (datasets: ReportDataset[]): string =>
  datasets
    .map((ds) => [esc(ds.title), ds.columns.map((c) => esc(c.label)).join(","), ...ds.rows.map((r) => ds.columns.map((c) => esc(cell(ds, c.key, c.kind, r))).join(","))].join("\n"))
    .join("\n\n");

const tableHtml = (ds: ReportDataset) =>
  `<h2>${escHtml(ds.title)}</h2><p>${escHtml(ds.description)}</p><table border="1" cellspacing="0" cellpadding="6"><thead><tr>${ds.columns.map((c) => `<th>${escHtml(c.label)}</th>`).join("")}</tr></thead><tbody>${ds.rows
    .map((r) => `<tr>${ds.columns.map((c) => `<td>${escHtml(cell(ds, c.key, c.kind, r))}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;

export const buildReportExcelHtml = (title: string, datasets: ReportDataset[]): string =>
  `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><title>${escHtml(title)}</title></head><body>${datasets.map(tableHtml).join("<br/>")}</body></html>`;

export function openReportPrintWindow(title: string, datasets: ReportDataset[]): boolean {
  if (typeof window === "undefined") return false;
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.write(`<html><head><title>${escHtml(title)}</title><style>body{font-family:system-ui,sans-serif;padding:24px;color:#111}table{border-collapse:collapse;width:100%;margin-bottom:24px;font-size:12px}th{background:#f3f4f6;text-align:left}h1{font-size:22px}h2{font-size:16px;margin-bottom:4px}p{margin:0 0 8px;color:#555;font-size:12px}</style></head><body><h1>${escHtml(title)}</h1>${datasets.map(tableHtml).join("")}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
  return true;
}

/** Runs the chosen export. Returns false if the browser blocked the PDF window. */
export function exportReportDatasets(format: ReportExportFormat, title: string, datasets: ReportDataset[]): boolean {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (format === "csv") downloadReportFile(`${slug}.csv`, buildReportCsv(datasets), "text/csv;charset=utf-8");
  else if (format === "excel") downloadReportFile(`${slug}.xls`, buildReportExcelHtml(title, datasets), "application/vnd.ms-excel");
  else return openReportPrintWindow(title, datasets);
  return true;
}
