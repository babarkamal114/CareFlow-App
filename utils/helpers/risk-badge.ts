type RiskLevel = "high" | "medium" | "low";

export const riskBadgeVariant: Record<RiskLevel, string> = {
  high: "pastel-danger",
  medium: "pastel-warning",
  low: "pastel-success",
};

export function getRiskBadgeVariant(risk: RiskLevel): string {
  return riskBadgeVariant[risk] || "pastel-neutral";
}

export const riskDotColor: Record<RiskLevel, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export function getRiskDotColor(risk: RiskLevel): string {
  return riskDotColor[risk] || "bg-gray-400";
}