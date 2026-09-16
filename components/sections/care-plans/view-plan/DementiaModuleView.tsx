'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CarePlanModule, DementiaContent } from "types";

interface DementiaModuleViewProps {
  module: CarePlanModule;
}

export function DementiaModuleView({ module }: DementiaModuleViewProps) {
  const content = module.content as DementiaContent;

  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dementia Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Type</p>
            <p className="text-sm text-cf-ink">{content.dementiaType}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Stage</p>
            <Badge className="capitalize">{content.stageOfDementia}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Cognitive Abilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Memory</p>
            <p className="text-sm text-cf-ink">{content.cognitiveAbilities.memory}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Communication</p>
            <p className="text-sm text-cf-ink">
              {content.cognitiveAbilities.communication}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">
              Problem Solving
            </p>
            <p className="text-sm text-cf-ink">
              {content.cognitiveAbilities.problemSolving}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Orientation</p>
            <p className="text-sm text-cf-ink">{content.cognitiveAbilities.orientation}</p>
          </div>
        </CardContent>
      </Card>

      {content.behavioralChallenges.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Behavioral Challenges & Strategies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.behavioralChallenges.map((challenge, i) => (
              <div key={`challenge-${challenge.behavior}-${i}`} className="p-2 bg-cf-surface-muted rounded-lg">
                <p className="text-sm font-medium text-cf-ink">{challenge.behavior}</p>
                <p className="text-xs text-cf-ink-60 mt-1">
                  Trigger: {challenge.trigger}
                </p>
                <p className="text-xs text-cf-ink-60 mt-1">
                  Strategy: {challenge.strategy}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {content.calmingStrategies.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Calming Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.calmingStrategies.map((strategy, i) => (
                <li key={`calm-${strategy}-${i}`} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">•</span>
                  {strategy}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {content.environmentalModifications.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Environmental Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.environmentalModifications.map((mod, i) => (
                <li key={`mod-${mod}-${i}`} className="text-sm text-cf-ink flex gap-2">
                  <span className="text-cf-primary">•</span>
                  {mod}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Communication Approach</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cf-ink">{content.communicationApproach}</p>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Family Involvement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cf-ink">{content.familyInvolvement}</p>
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