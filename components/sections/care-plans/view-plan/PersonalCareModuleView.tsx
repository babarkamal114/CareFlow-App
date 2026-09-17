'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CarePlanModule, PersonalCareContent } from "types";

interface PersonalCareModuleViewProps {
  module: CarePlanModule;
}

export function PersonalCareModuleView({ module }: PersonalCareModuleViewProps) {
  const content = module.content as PersonalCareContent;

  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Mobility Level</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className="capitalize">
            {content.mobilityLevel.replace('-', ' ')}
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Personal Hygiene</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Bathing</p>
            <p className="text-sm text-cf-ink">{content.personalHygiene.bathing}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Toileting</p>
            <p className="text-sm text-cf-ink">{content.personalHygiene.toileting}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Dressing</p>
            <p className="text-sm text-cf-ink">{content.personalHygiene.dressing}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Grooming</p>
            <p className="text-sm text-cf-ink">{content.personalHygiene.grooming}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Continence Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Status</p>
            <Badge className="capitalize" variant="pastel-info">
              {content.continenceSupport.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Plan</p>
            <p className="text-sm text-cf-ink">{content.continenceSupport.plan}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Skin Integrity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">
              Pressure Ulcer Risk
            </p>
            <Badge
              variant={
                content.skinIntegrity.pressure_ulcer_risk === 'high'
                  ? 'pastel-danger'
                  : 'pastel-warning'
              }
              className="capitalize"
            >
              {content.skinIntegrity.pressure_ulcer_risk}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-2">
              Prevention Measures
            </p>
            <ul className="space-y-1">
              {content?.skinIntegrity?.preventionMeasures.map((measure, i) => (
                <li key={i} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">•</span>
                  {measure}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

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

      {content.preferences.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.preferences.map((pref, i) => (
                <Badge key={i} variant="pastel-info">
                  {pref}
                </Badge>
              ))}
            </div>
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