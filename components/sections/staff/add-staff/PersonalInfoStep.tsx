"use client";

import { ConfigField } from "./AddStaffFormPrimitives";
import {
  ADD_STAFF_GROUP_LAYOUT_CLASS,
  PERSONAL_INFO_FIELD_GROUPS,
  setAddStaffTextField,
  type AddStaffPersonalInfo,
} from "utils";

interface Props {
  data: AddStaffPersonalInfo;
  onChange: (d: AddStaffPersonalInfo) => void;
}

export function PersonalInfoStep({ data, onChange }: Props) {
  const handleChange = (key: keyof AddStaffPersonalInfo, value: string) =>
    onChange(setAddStaffTextField(data, key, value));

  return (
    <div className="space-y-4">
      {PERSONAL_INFO_FIELD_GROUPS.map((group) => (
        <div key={group.id} className={ADD_STAFF_GROUP_LAYOUT_CLASS[group.columns]}>
          {group.fields.map((field) => (
            <ConfigField
              key={field.key}
              field={field}
              value={data[field.key]}
              onChange={handleChange}
            />
          ))}
        </div>
      ))}
    </div>
  );
}