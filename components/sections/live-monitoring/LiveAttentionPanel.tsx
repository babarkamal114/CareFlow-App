import React from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AlertCircle, Clock, User, Shield, FileText, Calendar, Wifi } from "lucide-react";
import { mockLiveAttentionItems, attentionTypeConfig, getPriority } from "utils";

const iconComponents: Record<string, React.ElementType> = {
  Clock,
  User,
  Shield,
  FileText,
  Calendar,
  Wifi,
};

function LiveAttentionPanel() {
  const highPriorityCount = mockLiveAttentionItems.filter(
    (item) => getPriority(item.type) === "high"
  ).length;

  return (
    <Card className="border-cf-border w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">Needs Attention</CardTitle>
        </div>
        <Badge variant="pastel-danger" shape="pill">
          {highPriorityCount} Urgent
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-cf-border">
          {mockLiveAttentionItems.map((item) => {
            const config = attentionTypeConfig[item.type];
            const IconComponent = iconComponents[config.icon] ?? AlertCircle;

            return (
              <div
                key={item.id}
                className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-cf-surface-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 text-cf-ink-60 mt-0.5">
                  <IconComponent className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-cf-ink">{item.title}</p>
                    {config.priority === "high" && (
                      <Badge variant={config.badgeVariant as never} badgeSize="sm">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-cf-ink-60">{item.description}</p>
                  <p className="text-[10px] text-cf-ink-40 mt-0.5">{item.detail}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-cf-ink-40">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default LiveAttentionPanel;