'use client';

import { useState } from 'react';
import {
  Input,
  Label,
  Button,
  Card, 
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui";
import { X, Plus } from 'lucide-react';
import { PatientFormData } from './PatientCreateModal';


interface MedicalHistoryStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

interface Condition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'managed' | 'resolved';
}

interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

interface Hospitalisation {
  id: string;
  date: string;
  reason: string;
  duration: string;
  outcome: string;
}

export function MedicalHistoryStep({ formData, setFormData }: MedicalHistoryStepProps) {
  const [newCondition, setNewCondition] = useState<Omit<Condition, 'id'>>({
    name: '',
    diagnosedDate: '',
    status: 'active',
  });

  const [newAllergy, setNewAllergy] = useState<Omit<Allergy, 'id'>>({
    name: '',
    severity: 'mild',
    reaction: '',
  });

  const [newHospitalisation, setNewHospitalisation] = useState<Omit<Hospitalisation, 'id'>>({
    date: '',
    reason: '',
    duration: '',
    outcome: '',
  });

  const handleAddCondition = () => {
    if (newCondition.name && newCondition.diagnosedDate) {
      const conditions = formData.conditions || [];
      setFormData({
        ...formData,
        conditions: [
          ...conditions,
          { ...newCondition, id: Date.now().toString() },
        ],
      });
      setNewCondition({ name: '', diagnosedDate: '', status: 'active' });
    }
  };

  const handleRemoveCondition = (id: string) => {
    setFormData({
      ...formData,
      conditions: (formData.conditions || []).filter((c: Condition) => c.id !== id),
    });
  };

  const handleAddAllergy = () => {
    if (newAllergy.name && newAllergy.reaction) {
      const allergies = formData.allergies || [];
      setFormData({
        ...formData,
        allergies: [
          ...allergies,
          { ...newAllergy, id: Date.now().toString() },
        ],
      });
      setNewAllergy({ name: '', severity: 'mild', reaction: '' });
    }
  };

  const handleRemoveAllergy = (id: string) => {
    setFormData({
      ...formData,
      allergies: (formData.allergies || []).filter((a: Allergy) => a.id !== id),
    });
  };

  const handleAddHospitalisation = () => {
    if (newHospitalisation.date && newHospitalisation.reason) {
      const hospitalisations = formData.hospitalisations || [];
      setFormData({
        ...formData,
        hospitalisations: [
          ...hospitalisations,
          { ...newHospitalisation, id: Date.now().toString() },
        ],
      });
      setNewHospitalisation({ date: '', reason: '', duration: '', outcome: '' });
    }
  };

  const handleRemoveHospitalisation = (id: string) => {
    setFormData({
      ...formData,
      hospitalisations: (formData.hospitalisations || []).filter((h: Hospitalisation) => h.id !== id),
    });
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-cf-ink">Medical History</h3>
        <p className="text-sm text-cf-ink-60">Health conditions, allergies, and hospital history</p>
      </div>

      {/* Conditions */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-cf-ink">Current Conditions</h4>
        <Card className="border-cf-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Condition Name</Label>
              <Input
                placeholder="Type 2 Diabetes"
                value={newCondition.name}
                onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })}
                className="border-cf-border h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Diagnosed Date</Label>
              <Input
                type="date"
                value={newCondition.diagnosedDate}
                onChange={(e) => setNewCondition({ ...newCondition, diagnosedDate: e.target.value })}
                className="border-cf-border h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Status</Label>
            <Select
              value={newCondition.status}
              onValueChange={(val) => setNewCondition({ ...newCondition, status: val as any })}
            >
              <SelectTrigger className="border-cf-border h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="managed">Managed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddCondition}
            variant="outline"
            size="sm"
            className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Condition
          </Button>
        </Card>

        {(formData.conditions || []).length > 0 && (
          <div className="space-y-2">
            {(formData.conditions || []).map((condition: Condition) => (
              <Card key={condition.id} className="border-cf-border p-3">
                <CardContent className="p-0 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cf-ink">{condition.name}</p>
                    <div className="flex items-center gap-2 text-xs text-cf-ink-60 mt-1">
                      <span>Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString('en-GB')}</span>
                      <span>•</span>
                      <span className="capitalize">{condition.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveCondition(condition.id)}
                    className="text-cf-ink-40 hover:text-cf-error transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Allergies */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-cf-ink">Allergies</h4>
        <Card className="border-cf-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Allergen</Label>
              <Input
                placeholder="Penicillin"
                value={newAllergy.name}
                onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
                className="border-cf-border h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Reaction</Label>
              <Input
                placeholder="Rash, difficulty breathing"
                value={newAllergy.reaction}
                onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                className="border-cf-border h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Severity</Label>
            <Select
              value={newAllergy.severity}
              onValueChange={(val) => setNewAllergy({ ...newAllergy, severity: val as any })}
            >
              <SelectTrigger className="border-cf-border h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddAllergy}
            variant="outline"
            size="sm"
            className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Allergy
          </Button>
        </Card>

        {(formData.allergies || []).length > 0 && (
          <div className="space-y-2">
            {(formData.allergies || []).map((allergy: Allergy) => (
              <Card key={allergy.id} className="border-l-4 border-l-red-500 p-3">
                <CardContent className="p-0 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cf-ink">{allergy.name}</p>
                    <div className="flex items-center gap-2 text-xs text-cf-ink-60 mt-1">
                      <span className="capitalize">{allergy.severity}</span>
                      <span>•</span>
                      <span>Reaction: {allergy.reaction}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAllergy(allergy.id)}
                    className="text-cf-ink-40 hover:text-cf-error transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Hospitalisations */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-cf-ink">Hospitalisations</h4>
        <Card className="border-cf-border p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Admission Date</Label>
              <Input
                type="date"
                value={newHospitalisation.date}
                onChange={(e) => setNewHospitalisation({ ...newHospitalisation, date: e.target.value })}
                className="border-cf-border h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Duration</Label>
              <Input
                placeholder="3 days"
                value={newHospitalisation.duration}
                onChange={(e) => setNewHospitalisation({ ...newHospitalisation, duration: e.target.value })}
                className="border-cf-border h-8 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Reason</Label>
            <Input
              placeholder="Chest infection, fractured hip"
              value={newHospitalisation.reason}
              onChange={(e) => setNewHospitalisation({ ...newHospitalisation, reason: e.target.value })}
              className="border-cf-border h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Outcome</Label>
            <Input
              placeholder="Fully recovered, ongoing physio"
              value={newHospitalisation.outcome}
              onChange={(e) => setNewHospitalisation({ ...newHospitalisation, outcome: e.target.value })}
              className="border-cf-border h-8 text-sm"
            />
          </div>
          <Button
            onClick={handleAddHospitalisation}
            variant="outline"
            size="sm"
            className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Hospitalisation
          </Button>
        </Card>

        {(formData.hospitalisations || []).length > 0 && (
          <div className="space-y-2">
            {(formData.hospitalisations || []).map((hospitalisation: Hospitalisation) => (
              <Card key={hospitalisation.id} className="border-cf-border p-3">
                <CardContent className="p-0 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cf-ink">{hospitalisation.reason}</p>
                    <div className="flex items-center gap-2 text-xs text-cf-ink-60 mt-1">
                      <span>{new Date(hospitalisation.date).toLocaleDateString('en-GB')}</span>
                      <span>•</span>
                      <span>{hospitalisation.duration}</span>
                      <span>•</span>
                      <span>{hospitalisation.outcome}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveHospitalisation(hospitalisation.id)}
                    className="text-cf-ink-40 hover:text-cf-error transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}