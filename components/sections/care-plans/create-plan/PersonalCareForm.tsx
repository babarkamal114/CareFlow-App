'use client';

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Textarea } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Badge } from "@/components/ui";
import { X, Plus } from 'lucide-react';
import { Button } from "@/components/ui";
import { PersonalCareCreationData } from "types";

interface PersonalCareFormProps {
  data: Partial<PersonalCareCreationData> | undefined;
  onUpdate: (data: Partial<PersonalCareCreationData>) => void;
  onValidate: (isValid: boolean) => void;
}

const mobilityLevels = [
  { value: 'independent', label: 'Independent' },
  { value: 'supervision', label: 'Supervision' },
  { value: 'assistance', label: 'Assistance' },
  { value: 'total-dependence', label: 'Total Dependence' },
];

const continenceStatuses = [
  { value: 'continent', label: 'Continent' },
  { value: 'incontinent', label: 'Incontinent' },
  { value: 'managed', label: 'Managed' },
];

const pressureUlcerRisks = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function PersonalCareForm({ data, onUpdate, onValidate }: PersonalCareFormProps) {
  const [newPreference, setNewPreference] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newPreventionMeasure, setNewPreventionMeasure] = useState('');

  const updateField = <K extends keyof PersonalCareCreationData>(
    field: K,
    value: PersonalCareCreationData[K]
  ) => {
    onUpdate({ ...data, [field]: value });
  };

  const updateNestedField = <
    K extends 'personalHygiene' | 'continenceSupport' | 'skinIntegrity',
    SubK extends keyof NonNullable<PersonalCareCreationData[K]>
  >(
    parent: K,
    field: SubK,
    value: NonNullable<PersonalCareCreationData[K]>[SubK]
  ) => {
    const parentObj = data?.[parent] || {};
    onUpdate({
      ...data,
      [parent]: { ...parentObj, [field]: value },
    });
  };

  const addItem = (
    field: 'preferences' | 'goals',
    item: string,
    setter: (value: string) => void
  ) => {
    if (!item.trim()) return;
    const currentItems = data?.[field] || [];
    onUpdate({ ...data, [field]: [...currentItems, item.trim()] });
    setter('');
  };

  const addPreventionMeasure = (item: string) => {
    if (!item.trim()) return;
    const currentIntegrity = data?.skinIntegrity || { pressure_ulcer_risk: 'low' as const, preventionMeasures: [] };
    const currentMeasures = currentIntegrity.preventionMeasures || [];
    onUpdate({
      ...data,
      skinIntegrity: {
        ...currentIntegrity,
        preventionMeasures: [...currentMeasures, item.trim()],
      },
    });
    setNewPreventionMeasure('');
  };

  const removePreventionMeasure = (index: number) => {
    const currentIntegrity = data?.skinIntegrity || { pressure_ulcer_risk: 'low' as const, preventionMeasures: [] };
    const currentMeasures = currentIntegrity.preventionMeasures || [];
    onUpdate({
      ...data,
      skinIntegrity: {
        ...currentIntegrity,
        preventionMeasures: currentMeasures.filter((_, i) => i !== index),
      },
    });
  };

  const removeItem = (field: 'preferences' | 'goals', index: number) => {
    const currentItems = data?.[field] || [];
    onUpdate({ ...data, [field]: currentItems.filter((_, i) => i !== index) });
  };

  useEffect(() => {
    const isValid = !!(
      data?.mobilityLevel &&
      data?.personalHygiene?.bathing &&
      data?.personalHygiene?.toileting &&
      data?.personalHygiene?.dressing &&
      data?.personalHygiene?.grooming &&
      data?.continenceSupport?.status &&
      data?.skinIntegrity?.pressure_ulcer_risk
    );
    onValidate(isValid);
  }, [data, onValidate]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mobilityLevel">Mobility Level *</Label>
        <Select
          value={data?.mobilityLevel}
          onValueChange={(value) => updateField('mobilityLevel', value as PersonalCareCreationData['mobilityLevel'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mobility level" />
          </SelectTrigger>
          <SelectContent>
            {mobilityLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Hygiene</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bathing">Bathing Needs *</Label>
            <Textarea
              id="bathing"
              placeholder="Describe bathing requirements..."
              value={data?.personalHygiene?.bathing || ''}
              onChange={(e) => updateNestedField('personalHygiene', 'bathing', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toileting">Toileting Needs *</Label>
            <Textarea
              id="toileting"
              placeholder="Describe toileting requirements..."
              value={data?.personalHygiene?.toileting || ''}
              onChange={(e) => updateNestedField('personalHygiene', 'toileting', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dressing">Dressing Needs *</Label>
            <Textarea
              id="dressing"
              placeholder="Describe dressing requirements..."
              value={data?.personalHygiene?.dressing || ''}
              onChange={(e) => updateNestedField('personalHygiene', 'dressing', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grooming">Grooming Needs *</Label>
            <Textarea
              id="grooming"
              placeholder="Describe grooming requirements..."
              value={data?.personalHygiene?.grooming || ''}
              onChange={(e) => updateNestedField('personalHygiene', 'grooming', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Continence Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="continenceStatus">Status *</Label>
            <Select
              value={data?.continenceSupport?.status}
              onValueChange={(value) => updateNestedField('continenceSupport', 'status', value as 'continent' | 'incontinent' | 'managed')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select continence status" />
              </SelectTrigger>
              <SelectContent>
                {continenceStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="continencePlan">Support Plan</Label>
            <Textarea
              id="continencePlan"
              placeholder="Describe continence support plan..."
              value={data?.continenceSupport?.plan || ''}
              onChange={(e) => updateNestedField('continenceSupport', 'plan', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skin Integrity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pressureUlcerRisk">Pressure Ulcer Risk *</Label>
            <Select
              value={data?.skinIntegrity?.pressure_ulcer_risk}
              onValueChange={(value) => updateNestedField('skinIntegrity', 'pressure_ulcer_risk', value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                {pressureUlcerRisks.map((risk) => (
                  <SelectItem key={risk.value} value={risk.value}>
                    {risk.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Prevention Measures</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add prevention measure..."
                value={newPreventionMeasure}
                onChange={(e) => setNewPreventionMeasure(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addPreventionMeasure(newPreventionMeasure);
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => addPreventionMeasure(newPreventionMeasure)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(data?.skinIntegrity?.preventionMeasures || []).map((measure: string, index: number) => (
                <Badge key={`measure-${measure}-${index}`} variant="secondary" className="flex items-center gap-1">
                  {measure}
                  <button
                    type="button"
                    onClick={() => removePreventionMeasure(index)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add preference..."
              value={newPreference}
              onChange={(e) => setNewPreference(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem('preferences', newPreference, setNewPreference);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => addItem('preferences', newPreference, setNewPreference)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data?.preferences || []).map((preference: string, index: number) => (
              <Badge key={`pref-${preference}-${index}`} variant="secondary" className="flex items-center gap-1">
                {preference}
                <button
                  type="button"
                  onClick={() => removeItem('preferences', index)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem('goals', newGoal, setNewGoal);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={() => addItem('goals', newGoal, setNewGoal)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data?.goals || []).map((goal: string, index: number) => (
              <Badge key={`goal-${goal}-${index}`} variant="secondary" className="flex items-center gap-1">
                {goal}
                <button
                  type="button"
                  onClick={() => removeItem('goals', index)}
                  className="hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes..."
          value={data?.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </div>
    </div>
  );
}