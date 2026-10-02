'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CarePlanModule, MentalHealthContent } from "types";

interface MentalHealthModuleViewProps {
  module: CarePlanModule;
}

export function MentalHealthModuleView({ module }: MentalHealthModuleViewProps) {
  const content = module.content as MentalHealthContent;

  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Current Mental Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cf-ink">{content.mentalHealthStatus}</p>
        </CardContent>
      </Card>

      {content.diagnosedConditions.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Diagnosed Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.diagnosedConditions.map((condition, i) => (
                <Badge key={`condition-${condition}-${i}`} variant="pastel-danger">
                  {condition}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Current Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cf-ink">{content.currentMood}</p>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Motivation Level</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant={
              content.motivationLevel === 'high'
                ? 'pastel-success'
                : content.motivationLevel === 'moderate'
                ? 'pastel-info'
                : 'pastel-warning'
            }
            className="capitalize"
          >
            {content.motivationLevel}
          </Badge>
        </CardContent>
      </Card>

      {content.stressorsAndTriggers.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Stressors & Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.stressorsAndTriggers.map((stressor, i) => (
                <li key={`stressor-${stressor}-${i}`} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">•</span>
                  {stressor}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.copingStrategies.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Coping Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.copingStrategies.map((strategy, i) => (
                <li key={`strategy-${strategy}-${i}`} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">•</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Support Network</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cf-ink">{content.supportNetwork}</p>
        </CardContent>
      </Card>

      {content.socialActivities.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Social Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.socialActivities.map((activity, i) => (
                <Badge key={`activity-${activity}-${i}`} variant="pastel-info">
                  {activity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.hobbiesAndInterests.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Hobbies & Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.hobbiesAndInterests.map((hobby, i) => (
                <Badge key={`hobby-${hobby}-${i}`} variant="pastel-success">
                  {hobby}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Self Care Ability</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cf-ink">{content.selfCareAbility}</p>
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
                <li key={`goal-${goal}-${i}`} className="text-sm text-cf-ink flex gap-2">
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