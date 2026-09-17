'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Label } from "@/components/ui"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import type { Patient } from "types";
import { Loader2 } from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth?: string;
  nhsNumber?: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'on-hold' | 'new' | 'discharged';
  carer: string;
  nextVisit: string;
  gpName?: string;
  gpPhone?: string;
  gpAddress?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
}

interface EditPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientData | null;
  onSave: (data: Partial<PatientData>) => Promise<void>;
}

export function EditPatientModal({
  open,
  onOpenChange,
  patient,
  onSave,
}: EditPatientModalProps) {
  const [formData, setFormData] = useState<Partial<PatientData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (patient && open) {
      setFormData({
        name: patient.name,
        preferredName: patient.preferredName || '',
        dateOfBirth: patient.dateOfBirth || '',
        nhsNumber: patient.nhsNumber || '',
        age: patient.age,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        risk: patient.risk,
        status: patient.status,
        carer: patient.carer,
        nextVisit: patient.nextVisit,
        gpName: patient.gpName || '',
        gpPhone: patient.gpPhone || '',
        gpAddress: patient.gpAddress || '',
        nextOfKinName: patient.nextOfKinName || '',
        nextOfKinPhone: patient.nextOfKinPhone || '',
        nextOfKinRelationship: patient.nextOfKinRelationship || '',
        emergencyContact: patient.emergencyContact || '',
        emergencyPhone: patient.emergencyPhone || '',
        emergencyRelationship: patient.emergencyRelationship || '',
      });
    }
  }, [patient, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (formData.age && (formData.age < 0 || formData.age > 120)) {
      newErrors.age = 'Age must be between 0 and 120';
    }
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Update patient information for {patient.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Patient Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name || ''}
                onChange={handleInputChange}
                className={`border-cf-border ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredName" className="text-sm font-medium">
                Preferred Name
              </Label>
              <Input
                id="preferredName"
                name="preferredName"
                placeholder="Dot"
                value={formData.preferredName || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={handleInputChange}
                className={`border-cf-border ${errors.dateOfBirth ? 'border-red-500' : ''}`}
              />
              {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nhsNumber" className="text-sm font-medium">
                NHS Number
              </Label>
              <Input
                id="nhsNumber"
                name="nhsNumber"
                placeholder="123 456 7890"
                value={formData.nhsNumber || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email || ''}
                onChange={handleInputChange}
                className={`border-cf-border ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="0161 123 4567"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className={`border-cf-border ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address *
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Main Street, Manchester"
              value={formData.address || ''}
              onChange={handleInputChange}
              className={`border-cf-border ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gpName" className="text-sm font-medium">
                GP Name
              </Label>
              <Input
                id="gpName"
                name="gpName"
                placeholder="Dr. Sarah Ahmed"
                value={formData.gpName || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpPhone" className="text-sm font-medium">
                GP Phone
              </Label>
              <Input
                id="gpPhone"
                name="gpPhone"
                placeholder="0161 123 4567"
                value={formData.gpPhone || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpAddress" className="text-sm font-medium">
              GP Address
            </Label>
            <Input
              id="gpAddress"
              name="gpAddress"
              placeholder="Oak Lane Surgery, Manchester"
              value={formData.gpAddress || ''}
              onChange={handleInputChange}
              className="border-cf-border"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextOfKinName" className="text-sm font-medium">
                Next of Kin Name
              </Label>
              <Input
                id="nextOfKinName"
                name="nextOfKinName"
                placeholder="Margaret Chen"
                value={formData.nextOfKinName || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextOfKinPhone" className="text-sm font-medium">
                Next of Kin Phone
              </Label>
              <Input
                id="nextOfKinPhone"
                name="nextOfKinPhone"
                placeholder="07700 900123"
                value={formData.nextOfKinPhone || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextOfKinRelationship" className="text-sm font-medium">
                Relationship
              </Label>
              <Input
                id="nextOfKinRelationship"
                name="nextOfKinRelationship"
                placeholder="Daughter"
                value={formData.nextOfKinRelationship || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-sm font-medium">
                Emergency Contact
              </Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                placeholder="Margaret Chen"
                value={formData.emergencyContact || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone" className="text-sm font-medium">
                Emergency Phone
              </Label>
              <Input
                id="emergencyPhone"
                name="emergencyPhone"
                placeholder="07700 900123"
                value={formData.emergencyPhone || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship" className="text-sm font-medium">
                Emergency Relationship
              </Label>
              <Input
                id="emergencyRelationship"
                name="emergencyRelationship"
                placeholder="Daughter"
                value={formData.emergencyRelationship || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carer" className="text-sm font-medium">
                Primary Carer
              </Label>
              <Input
                id="carer"
                name="carer"
                placeholder="Sarah Johnson"
                value={formData.carer || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextVisit" className="text-sm font-medium">
                Next Visit
              </Label>
              <Input
                id="nextVisit"
                name="nextVisit"
                placeholder="Today, 2:00 PM"
                value={formData.nextVisit || ''}
                onChange={handleInputChange}
                className="border-cf-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk" className="text-sm font-medium">
                Risk Level
              </Label>
              <Select
                value={formData.risk || ''}
                onValueChange={(val) => handleSelectChange('risk', val!)}
              >
                <SelectTrigger className="border-cf-border">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status || ''}
                onValueChange={(val) => handleSelectChange('status', val!)}
              >
                <SelectTrigger className="border-cf-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-cf-border hover:bg-cf-surface-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-cf-primary hover:bg-cf-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}