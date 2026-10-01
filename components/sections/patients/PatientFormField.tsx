'use client';

import { Fragment } from 'react';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import type { PatientFieldDef, PatientFieldSection } from 'utils';

type FieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface PatientFormFieldProps {
  field: PatientFieldDef;
  value: string;
  error?: string | undefined;
  onInputChange: FieldChangeHandler;
  onSelectChange?: (name: string, value: string) => void;
}

/**
 * One label + input / textarea / select (+ error or hint), driven by a field config.
 * Shared by the add-patient wizard steps and the edit-patient modal.
 */
export function PatientFormField({ field, value, error, onInputChange, onSelectChange }: PatientFormFieldProps) {
  if (field.kind === 'select') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
        </Label>
        <Select value={value} onValueChange={(val) => onSelectChange?.(field.name, val!)}>
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

  if (field.kind === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.name} className="text-sm font-medium">
          {field.label}
        </Label>
        <Textarea
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          value={value}
          onChange={onInputChange}
          className={`border-cf-border ${field.minHeightClass}`}
        />
        {field.hint && <p className="text-xs text-cf-ink-40">{field.hint}</p>}
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

interface PatientFormSectionsProps<N extends string> {
  sections: PatientFieldSection<N>[];
  values: Partial<Record<N, string>>;
  errors?: Record<string, string>;
  onInputChange: FieldChangeHandler;
  onSelectChange?: (name: string, value: string) => void;
}

/** Renders a list of field sections: a grid when the section has a gridClass, otherwise one field per row. */
export function PatientFormSections<N extends string>({
  sections,
  values,
  errors,
  onInputChange,
  onSelectChange,
}: PatientFormSectionsProps<N>) {
  return (
    <>
      {sections.map((section) => {
        const fields = section.fields.map((field) => (
          <PatientFormField
            key={field.name}
            field={field}
            value={values[field.name] || ''}
            error={errors?.[field.name]}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
          />
        ));

        return section.gridClass ? (
          <div key={section.id} className={section.gridClass}>
            {fields}
          </div>
        ) : (
          <Fragment key={section.id}>{fields}</Fragment>
        );
      })}
    </>
  );
}