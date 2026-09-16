import { TrendDownIcon, TrendNeutralIcon, TrendUpIcon } from "@/components/ui";
import type { StatCardTrend } from "types";

export const showStatTrend = (trend: StatCardTrend) => {
  switch (trend) {
    case "up":
      return <TrendUpIcon />;
    case "down":
      return <TrendDownIcon />;
    case "neutral":
      return <TrendNeutralIcon />;
  }
};
