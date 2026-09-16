import { MagicCard } from "@/components/ui";
import { ArrowDown, ArrowUp } from "lucide-react";
import { StatCardProps } from "types";
import { Badge } from "@/components/ui";
import { getScoreRingColor, showStatTrend } from "utils";

function StatCard({
  description,
  Icon,
  label,
  value,
  score,
  showScore,
  showTrend,
  trend,
  cqcScore,
  hasCqcScore,
  hasValueBadge,
  valueBadgeValue,
  badgeVariant = "softSuccess",
  children
}: StatCardProps) {
  return (
      <MagicCard
      mode="gradient"
      gradientColor="var(--cf-brand-500)"
      gradientOpacity={0.12}
      gradientSize={200}
      gradientFrom="var(--cf-brand-500)"
      gradientTo="var(--cf-brand-400)"
      className="w-full rounded-xl cf-glass-panel"
    >
      <div className="flex flex-col gap-4 py-4 px-4">
        <div className="flex items-center justify-between">
          <Badge variant={badgeVariant} badgeSize={'icon'}>
            <Icon className="size-4" />
          </Badge>

          <div className="flex items-center gap-2">
            {showTrend && trend && showStatTrend(trend)}
            
            {showScore && score !== undefined && (
              <div
                className={`
                  w-6 h-6
                  flex items-center justify-center
                  text-xs font-bold
                  rounded-full ring-[6px] ${getScoreRingColor(score)}
                  
                `}
              >
                {score}
              </div>
            )}
          </div>
        </div>


        <h1 className="text-xs text-cf-ink-40 font-semibold tracking-wider">
          {label.toUpperCase()}
        </h1>
        <div className="flex items-end gap-2">
          <h1 className="text-4xl font-bold text-cf-ink leading-none">{value}</h1>

          <div className="flex items-end gap-2">
            {hasValueBadge && (
              <Badge 
                variant="softSuccess" 
                shape="pill"
                badgeSize={'md'}
              >
                <ArrowUp className="size-3.5" />
                {valueBadgeValue}
              </Badge>
            )}

            {hasCqcScore && (
                <span className="text-md font-bold text-cf-ink-40">/100</span>   
            )}
          </div>
        </div>

        <div>
          {children}
        </div>

      </div>
    </MagicCard>
  );
}

export default StatCard;