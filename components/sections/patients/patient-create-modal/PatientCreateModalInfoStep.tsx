'use client';

import {
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { PatientFormData } from './PatientCreateModal';


interface PatientInfoStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export function PatientInfoStep({
  formData,
  setFormData,
  errors,
  setErrors,
}: PatientInfoStepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-cf-ink">
        Personal Details
      </h3>
      <p className="text-sm text-cf-ink-60">
        Basic information about the patient
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Dorothy Chen"
            value={formData.name}
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Address *
        </Label>
        <Input
          id="address"
          name="address"
          placeholder="123 Oak Street, Manchester, M1 2AB"
          value={formData.address}
          onChange={handleInputChange}
          className={`border-cf-border ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="dorothy@email.com"
            value={formData.email}
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
            value={formData.phone}
            onChange={handleInputChange}
            className={`border-cf-border ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
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
          GP Surgery Address
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
          <Label htmlFor="risk" className="text-sm font-medium">
            Risk Level *
          </Label>
          <Select
            value={formData.risk}
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
            Status *
          </Label>
          <Select
            value={formData.status}
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
  );
}