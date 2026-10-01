'use client';

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { PatientFieldDef } from 'utils';

interface PatientFormFieldProps {
  field: PatientFieldDef;
  value: string;
  error: string | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function PatientFormField({ field, value, error, onInputChange, onSelectChange }: PatientFormFieldProps) {
  if (field.kind === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
        </Label>
        <Select value={value} onValueChange={(val) => onSelectChange(field.name, val!)}>
          <SelectTrigger className="border-cf-border">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={onInputChange}
        className={`border-cf-border ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}