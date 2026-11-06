import { format } from "date-fns";

export const formatPrice = (price: number | null): string => {
  if (price === null || price === 0) return "Contact us";
  const pounds = price / 100;
  if (pounds % 1 === 0) {
    return `£${pounds}`;
  }
  return `£${pounds.toFixed(2)}`;
};

export const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));


export const truncateLabel = (v: unknown) => (String(v).length > 12 ? `${String(v).slice(0, 11)}…` : String(v));

export const toIsoDate = (d: Date | undefined) => (d ? format(d, "yyyy-MM-dd") : "");