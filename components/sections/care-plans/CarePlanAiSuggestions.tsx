'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import {
  generateCarePlanSuggestions,
  mockVisitNotes,
  type CarePlanSuggestion,
} from 'utils';

interface CarePlanAiSuggestionsProps {
  patientNames: Record<string, string>;
  onViewPlan?: (patientId: string) => void;
  orientation?: 'vertical' | 'horizontal';
}

const MODULE_LABEL: Record<CarePlanSuggestion['module'], string> = {
  nutrition: 'Nutrition',
  medication: 'Medication',
  'personal-care': 'Personal Care',
  mobility: 'Mobility',
  'mental-health': 'Mental Health',
};

export function CarePlanAiSuggestions({
  patientNames,
  onViewPlan,
  orientation = 'vertical',
}: CarePlanAiSuggestionsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const suggestions = generateCarePlanSuggestions(mockVisitNotes, patientNames).filter(
    (s) => !dismissed.has(s.id),
  );

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  if (suggestions.length === 0) return null;

  const isHorizontal = orientation === 'horizontal';

  const renderSuggestion = (s: CarePlanSuggestion, i: number) => {
    const isWarning = s.severity === 'warning';
    return (
      <motion.div
        key={s.id}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: isHorizontal ? undefined : 0, width: isHorizontal ? 0 : undefined, marginBottom: 0 }}
        transition={{ duration: 0.25, delay: i * 0.05 }}
        className={`rounded-lg border p-3 ${
          isWarning
            ? 'border-[var(--cf-warning)]/20 bg-[var(--cf-warning-muted)]'
            : 'border-[var(--cf-info)]/20 bg-[var(--cf-info-muted)]'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium text-cf-ink">{s.patientName}</span>
              <Badge variant="outline" className="text-[10px]">
                {MODULE_LABEL[s.module]}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-cf-ink-80">{s.message}</p>
            <p
              className={`mt-1 text-xs font-medium ${
                isWarning ? 'text-[var(--cf-warning)]' : 'text-[var(--cf-info)]'
              }`}
            >
              {s.suggestion}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDismiss(s.id)}
            className="size-6 shrink-0 rounded-md text-cf-ink-40 hover:bg-cf-surface-muted hover:text-cf-ink"
            aria-label="Dismiss suggestion"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        {onViewPlan && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewPlan(s.patientId)}
            className="mt-2 h-auto p-0 justify-start gap-1 text-xs font-medium text-cf-ink-60 hover:bg-transparent hover:text-cf-ink"
          >
            Review care plan
            <ArrowRight className="size-3" />
          </Button>
        )}
      </motion.div>
    );
  };

  if (isHorizontal) {
    return (
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full">
        <CardHeader className="flex flex-row items-center gap-2 pb-3 pt-4 px-4">
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[var(--cf-info-muted)]">
            <Sparkles className="size-4 text-[var(--cf-info)]" />
          </span>
          <div>
            <CardTitle className="text-sm font-semibold text-cf-ink">
              Suggested Updates
            </CardTitle>
            <p className="text-xs text-cf-ink-60">Based on recent visit notes</p>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          <AnimatePresence initial={false}>
            <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
              {suggestions.map((s, i) => renderSuggestion(s, i))}
            </div>
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full max-h-80 flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-2 pb-3 pt-4 px-4 shrink-0">
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-[var(--cf-info-muted)]">
          <Sparkles className="size-4 text-[var(--cf-info)]" />
        </span>
        <div>
          <CardTitle className="text-sm font-semibold text-cf-ink">
            Suggested Updates
          </CardTitle>
          <p className="text-xs text-cf-ink-60">Based on recent visit notes</p>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-2 overflow-y-auto">
        <AnimatePresence initial={false}>
          {suggestions.map((s, i) => renderSuggestion(s, i))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}