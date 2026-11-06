'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CarePlanModule, MobilityContent } from "types";

interface MobilityModuleViewProps {
  module: CarePlanModule;
}

export function MobilityModuleView({ module }: MobilityModuleViewProps) {
  const content = module.content as MobilityContent;

  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Mobility Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="capitalize" variant="pastel-info">
            {content.mobilityStatus.replace('-', ' ')}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Fall Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Risk Level</p>
            <Badge
              variant={
                content.fallRisk === 'high'
                  ? 'pastel-danger'
                  : content.fallRisk === 'medium'
                  ? 'pastel-warning'
                  : 'pastel-success'
              }
              className="capitalize"
            >
              {content.fallRisk}
            </Badge>
          </div>
          {content.fallRiskFactors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-cf-ink-60 mb-2">Risk Factors</p>
              <ul className="space-y-1">
                {content.fallRiskFactors.map((factor, i) => (
                  <li key={i} className="text-sm text-cf-ink flex gap-2">
                    <span className="text-cf-primary">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {content.mobilityAids.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Mobility Aids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.mobilityAids.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-cf-surface-muted rounded-lg"
                >
                  <span className="text-sm text-cf-ink">{item.aid}</span>
                  <Badge variant="pastel-info" className="text-xs capitalize">
                    {item.type.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.transferNeeds.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Transfer Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.transferNeeds.map((transfer, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-cf-surface-muted rounded-lg"
                >
                  <span className="text-sm text-cf-ink capitalize">
                    {transfer.type.replace('-', ' ')}
                  </span>
                  <Badge variant="pastel-warning" className="text-xs capitalize">
                    {transfer.assistance.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.preventionMeasures.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Prevention Measures</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.preventionMeasures.map((measure, i) => (
                <li key={i} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">•</span>
                  {measure}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.physicalTherapy && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Physical Therapy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cf-ink">{content.physicalTherapy}</p>
          </CardContent>
        </Card>
      )}

      {content.exercisePlan && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Exercise Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cf-ink">{content.exercisePlan}</p>
          </CardContent>
        </Card>
      )}

      {content.goals.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.goals.map((goal, i) => (
                <li key={i} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">→</span>
                  {goal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.notes && (
        <Card className="border-cf-border bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cf-ink whitespace-pre-wrap">
              {content.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}