'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  Badge,
} from '@/components/ui';
import { Incident, IncidentSeverity, IncidentType } from '@/types';


interface ReportIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const incidentTypes: { value: IncidentType; label: string }[] = [
  { value: 'fall', label: 'Fall / Slip' },
  { value: 'medication-error', label: 'Medication Error' },
  { value: 'bruise', label: 'Bruise / Injury' },
  { value: 'abuse-allegation', label: 'Abuse Allegation' },
  { value: 'safeguarding', label: 'Safeguarding Concern' },
  { value: 'missed-visit', label: 'Missed Visit' },
  { value: 'other', label: 'Other' },
];

const severityLevels: { value: IncidentSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'pastel-info' },
  { value: 'medium', label: 'Medium', color: 'pastel-warning' },
  { value: 'high', label: 'High', color: 'pastel-danger' },
  { value: 'critical', label: 'Critical', color: 'pastel-danger' },
];

export function ReportIncidentModal({
  open,
  onOpenChange,
  onSubmit,
}: ReportIncidentModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '' as IncidentType,
    severity: '' as IncidentSeverity,
    title: '',
    description: '',
    patientName: '',
    patientId: '',
    dateTime: new Date().toISOString().slice(0, 16),
    location: '',
    reportedBy: 'Current User (placeholder)',
    assignedTo: 'John Manager (placeholder)',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      dateTime: new Date(formData.dateTime),
      status: 'reported',
      investigationNotes: [
        {
          note: `Incident reported by ${formData.reportedBy}`,
          author: formData.reportedBy,
          timestamp: new Date(),
        },
      ],
      witnesses: [],
      evidence: [],
    };
    onSubmit(incident);
    setStep(1);
    setFormData({
      type: 'other',
      severity: 'low',
      title: '',
      description: '',
      patientName: '',
      patientId: '',
      dateTime: new Date().toISOString().slice(0, 16),
      location: '',
      reportedBy: 'Current User (placeholder)',
      assignedTo: 'John Manager (placeholder)',
    });
    onOpenChange(false);
  };

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
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-cf-ink mb-2 block">
                Severity *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleChange('severity', level.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.severity === level.value
                        ? 'border-cf-primary bg-cf-primary/10'
                        : 'border-cf-border bg-white'
                    }`}
                  >
                    <Badge variant={level.color as any} className="w-full justify-center">
                      {level.label}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(2)}
                disabled={!formData.type || !formData.severity}
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
              <label className="text-sm font-medium text-cf-ink mb-2 block">
                Incident Title *
              </label>
              <Input
                placeholder="e.g., Fall in bathroom"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-cf-ink mb-2 block">
                Description *
              </label>
              <Textarea
                placeholder="What happened? Any injuries? Any witnesses?"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-cf-ink mb-2 block">
                  Date & Time *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => handleChange('dateTime', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-cf-ink mb-2 block">
                  Location
                </label>
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
                disabled={!formData.patientName || !formData.title || !formData.description}
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
                      {incidentTypes.find((t) => t.value === formData.type)?.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cf-ink-60">Severity</p>
                    <Badge
                      variant={
                        severityLevels.find((s) => s.value === formData.severity)?.color as any
                      }
                    >
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
                      {new Date(formData.dateTime).toLocaleDateString()} at{' '}
                      {new Date(formData.dateTime).toLocaleTimeString()}
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