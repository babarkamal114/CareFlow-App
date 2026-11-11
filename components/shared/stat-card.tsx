import Link from "next/link";
import { MagicCard } from "@/components/ui";
import { ArrowDown, ArrowUp } from "lucide-react";
import { StatCardProps } from "types";
import { Badge, Button } from "@/components/ui"; 
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
  href,       
  onSelect,  
  isActive,   
  linkLabel,  
  children
}: StatCardProps) {
  
  const isDown = trend === "down";

  const card = (
    <MagicCard
      mode="gradient"
      gradientColor="var(--cf-brand-500)"
      gradientOpacity={0.12}
      gradientSize={200}
      gradientFrom="var(--cf-brand-500)"
      gradientTo="var(--cf-brand-400)"
      className="h-full w-full rounded-xl cf-glass-panel" 
    >
      <div className="flex flex-col gap-4 py-4 px-4">
        <div className="flex items-center justify-between">
          <Badge variant={badgeVariant} badgeSize={'icon'}>
            <Icon className="size-4" aria-hidden="true" />
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

        <p className="text-xs text-cf-ink-40 font-semibold tracking-wider">
          {label.toUpperCase()}
        </p>
        <div className="flex items-end gap-2">
          <p className="text-4xl font-bold text-cf-ink leading-none">{value}</p>

          <div className="flex items-end gap-2">
            {hasValueBadge && (
              <Badge 
                variant={isDown ? "softDanger" : "softSuccess"} 
                shape="pill"
                badgeSize={'md'}
              >
                {isDown ? (
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                ) : (
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                )}
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

  const clickable =
    "cursor-pointer transition-transform hover:-translate-y-0.5 " +
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0 " +
    "focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[var(--cf-brand-500)] focus-visible:ring-offset-2";

  if (onSelect) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={onSelect}
        aria-pressed={isActive} 
        aria-label={linkLabel}
        className={
          `block h-full w-full min-w-0 justify-start whitespace-normal rounded-xl p-0 ` +
          `text-left font-normal hover:bg-transparent dark:hover:bg-transparent ` +
          `${clickable} ` +
          `${isActive}`
        }
      >
        {card}
      </Button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-label={linkLabel}
        className={`block h-full w-full rounded-xl ${clickable}`}
      >
        {card}
      </Link>
    );
  }
  return card;
}

export default StatCard;