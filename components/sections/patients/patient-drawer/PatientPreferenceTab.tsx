'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Clock, Coffee, Heart, ThumbsUp, ThumbsDown } from 'lucide-react';

interface PatientPreferencesTabProps {
  wakeTime?: string;
  bedTime?: string;
  breakfastTime?: string;
  lunchTime?: string;
  dinnerTime?: string;
  bathPreference?: string;
  teaPreference?: string;
  dietaryPreferences?: string;
  culturalReligious?: string;
  likes?: string;
  dislikes?: string;
  hobbies?: string;
  dailyRoutine?: string;
}

export function PatientPreferencesTab({
  wakeTime,
  bedTime,
  breakfastTime,
  lunchTime,
  dinnerTime,
  bathPreference,
  teaPreference,
  dietaryPreferences,
  culturalReligious,
  likes,
  dislikes,
  hobbies,
  dailyRoutine,
}: PatientPreferencesTabProps) {
  return (
    <div className="space-y-4">
      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-cf-ink-60" />
            Daily Routine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {wakeTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Wakes</span>
              <span className="text-cf-ink font-medium">{wakeTime}</span>
            </div>
          )}
          {bedTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Bedtime</span>
              <span className="text-cf-ink font-medium">{bedTime}</span>
            </div>
          )}
          {breakfastTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Breakfast</span>
              <span className="text-cf-ink font-medium">{breakfastTime}</span>
            </div>
          )}
          {lunchTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Lunch</span>
              <span className="text-cf-ink font-medium">{lunchTime}</span>
            </div>
          )}
          {dinnerTime && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Dinner</span>
              <span className="text-cf-ink font-medium">{dinnerTime}</span>
            </div>
          )}
          {bathPreference && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Bath Preference</span>
              <span className="text-cf-ink font-medium">{bathPreference}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Coffee className="h-4 w-4 text-cf-ink-60" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teaPreference && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Tea Preference</span>
              <span className="text-cf-ink font-medium">{teaPreference}</span>
            </div>
          )}
          {dietaryPreferences && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Dietary</span>
              <span className="text-cf-ink font-medium">{dietaryPreferences}</span>
            </div>
          )}
          {culturalReligious && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Cultural/Religious</span>
              <span className="text-cf-ink font-medium">{culturalReligious}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-cf-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Heart className="h-4 w-4 text-cf-ink-60" />
            Likes & Dislikes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {likes && (
            <div className="p-2 bg-green-50/50 rounded-lg border border-green-200/50">
              <div className="flex items-start gap-2">
                <ThumbsUp className="h-4 w-4 text-green-600 mt-0.5" />
                <p className="text-sm text-cf-ink">{likes}</p>
              </div>
            </div>
          )}
          {dislikes && (
            <div className="p-2 bg-red-50/50 rounded-lg border border-red-200/50">
              <div className="flex items-start gap-2">
                <ThumbsDown className="h-4 w-4 text-red-600 mt-0.5" />
                <p className="text-sm text-cf-ink">{dislikes}</p>
              </div>
            </div>
          )}
          {hobbies && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-ink-60">Hobbies</span>
              <span className="text-cf-ink font-medium">{hobbies}</span>
            </div>
          )}
          {dailyRoutine && (
            <div className="p-2 bg-cf-surface-muted rounded-lg">
              <p className="text-sm text-cf-ink-60">{dailyRoutine}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}