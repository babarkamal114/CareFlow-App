'use client';

import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  Button, Input, Textarea,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Card, Badge, Label,
} from '@/components/ui';
import {
  INCIDENT_TYPE_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
  getDefaultIncidentFormData,
  getIncidentTypeOptionLabel,
  getSeverityOption,
  isIncidentStepOneValid,
  isIncidentStepTwoValid,
  buildIncidentPayload,
  formatIncidentDateTime,
  type IncidentFormData,
} from 'utils';

interface ReportIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (incident: Omit<import('@/types').Incident, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function ReportIncidentModal({
  open,
  onOpenChange,
  onSubmit,
}: ReportIncidentModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IncidentFormData>(getDefaultIncidentFormData);

  const handleChange = (field: keyof IncidentFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(buildIncidentPayload(formData));
    setStep(1);
    setFormData(getDefaultIncidentFormData());
    onOpenChange(false);
  };

  const selectedSeverity = getSeverityOption(formData.severity as never);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report Incident / Safeguarding Concern</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-cf-ink mb-2 block">
                Incident Type *
              </label>
              <Select value={formData.type} onValueChange={(v) => handleChange('type', v!)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {INCIDENT_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-cf-ink mb-2 block">
                Severity *
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {INCIDENT_SEVERITY_OPTIONS.map((level) => (
                  <Button
                    key={level.value}
                    onClick={() => handleChange('severity', level.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.severity === level.value
                        ? 'border-cf-primary bg-cf-primary/10'
                        : 'border-cf-border bg-white'
                    }`}
                  >
                    <Badge variant={level.color} className="w-full justify-center">
                      {level.label}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(2)}
                disabled={!isIncidentStepOneValid(formData)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-cf-ink mb-2 block">
                Patient Name *
              </label>
              <Input
                placeholder="Patient name"
                value={formData.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-cf-ink mb-2 block">
                Incident Title *
              </Label>
              <Input
                placeholder="e.g., Fall in bathroom"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-cf-ink mb-2 block">
                Description *
              </Label>
              <Textarea
                placeholder="What happened? Any injuries? Any witnesses?"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-cf-ink mb-2 block">
                  Date & Time *
                </Label>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleChange('dateTime', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-cf-ink mb-2 block">
                  Location
                </Label>
                <Input
                  placeholder="e.g., Bathroom, Kitchen"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(3)}
                disabled={!isIncidentStepTwoValid(formData)}
              >
                Review
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Card className="border-cf-border p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-cf-ink-60">Type</p>
                    <p className="font-medium text-cf-ink">
                      {getIncidentTypeOptionLabel(formData.type as never)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cf-ink-60">Severity</p>
                    <Badge variant={selectedSeverity?.color}>
                      {formData.severity}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-cf-ink-60">Patient</p>
                    <p className="font-medium text-cf-ink">{formData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cf-ink-60">Date & Time</p>
                    <p className="font-medium text-cf-ink">
                      {formatIncidentDateTime(new Date(formData.dateTime))}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-cf-ink-60">Title</p>
                  <p className="font-medium text-cf-ink">{formData.title}</p>
                </div>
                <div>
                  <p className="text-xs text-cf-ink-60">Description</p>
                  <p className="text-sm text-cf-ink whitespace-pre-wrap">
                    {formData.description}
                  </p>
                </div>
                {formData.location && (
                  <div>
                    <p className="text-xs text-cf-ink-60">Location</p>
                    <p className="font-medium text-cf-ink">{formData.location}</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                Submit Incident Report
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}