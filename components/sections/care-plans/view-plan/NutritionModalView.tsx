'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { CarePlanModule, NutritionContent } from "types";

interface NutritionModuleViewProps {
  module: CarePlanModule;
}

export function NutritionModuleView({ module }: NutritionModuleViewProps) {
  const content = module.content as NutritionContent;

  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Nutrition Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-2">
              MUST Score (Malnutrition Universal Screening Tool)
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-cf-primary">
                {content.MUSTScore}
              </span>
              <Badge
                variant={
                  content.nutritionStatus === 'malnourished'
                    ? 'pastel-danger'
                    : content.nutritionStatus === 'at-risk'
                    ? 'pastel-warning'
                    : 'pastel-success'
                }
              >
                {content.nutritionStatus.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dietary Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Diet Type</p>
            <Badge className="capitalize" variant="pastel-info">
              {content.dietaryType.replace('-', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {content.foodPreferences.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Food Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.foodPreferences.map((pref, i) => (
                <Badge key={i} variant="pastel-success">
                  {pref}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.dislikesAndAllergies.length > 0 && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Allergies & Intolerances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.dislikesAndAllergies.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-cf-surface-muted rounded-lg"
                >
                  <span className="text-sm text-cf-ink">{item.item}</span>
                  <Badge
                    variant={
                      item.type === 'allergy'
                        ? 'pastel-danger'
                        : item.type === 'intolerance'
                        ? 'pastel-warning'
                        : 'pastel-neutral'
                    }
                    className="text-xs capitalize"
                  >
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Swallowing Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">
              Swallowing Difficulties
            </p>
            <Badge
              variant={content.swallowingDifficulties ? 'pastel-warning' : 'pastel-success'}
            >
              {content.swallowingDifficulties ? 'Yes' : 'No'}
            </Badge>
          </div>
          {content.swallowingDifficulties && (
            <div>
              <p className="text-xs font-medium text-cf-ink-60 mb-1">Plan</p>
              <p className="text-sm text-cf-ink">{content.swallowingPlan}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Fluid Intake</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Recommended</p>
            <p className="text-sm text-cf-ink">{content.fluidIntake.recommended}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-cf-ink-60 mb-1">Method</p>
            <p className="text-sm text-cf-ink">{content.fluidIntake.method}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Meal Times</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-cf-ink">{content.mealTimes}</p>
        </CardContent>
      </Card>

      {content.supplementation && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Supplementation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cf-ink">{content.supplementation}</p>
          </CardContent>
        </Card>
      )}

      {content.appetiteChanges && (
        <Card className="border-cf-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Appetite Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cf-ink">{content.appetiteChanges}</p>
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