"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/utils/PasswordInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectOption = {
  value: string;
  label: string;
};
export interface SettingFormField {
  id: string;
  label: string;
  desc?: string;
  type: string;
  placeholder?: string;
  value: string;
  handleUpdate: (val: any) => void;
  disabled: boolean;

  selectOptions?: SelectOption[]; // only used for select
}

interface SettingFormProps {
  fields: SettingFormField[];
  isSubmitting: boolean;
  formClassName: string;
}

export const SettingForm = ({
  fields,
  isSubmitting,
  formClassName,
}: SettingFormProps) => {
  return (
    <div className={formClassName}>
      {fields.map((field, i) => {
        return (
          <div
            key={`profileSetting-${field.id}-${i}`}
            className="flex flex-col justify-start items-start gap-1.5"
          >
            {field.label && (
              <Label
                htmlFor={field.id}
                className="flex justify-end items-center font-semibold text-sm px-1"
              >
                {field.label}:
              </Label>
            )}
            <div className="flex justify-start items-center w-[220px]">
              {renderField(field)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const renderField = (field: SettingFormField) => {
  if (field.type === "password") {
    return (
      <div className="flex flex-col justify-start items-start w-full">
        <PasswordInput
          id={field.id}
          name={field.id}
          placeholder={field.placeholder}
          value={field.value}
          required
          disabled={field.disabled}
          parentClassName="col-span-2 flex justify-start items-center w-full relative"
          eyeClassName="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
          handleUpdate={field.handleUpdate}
        />
      </div>
    );
  } else if (field.type === "select") {
    return (
      <Select
        value={field.value}
        onValueChange={(value) => field.handleUpdate(value)}
        disabled={field.disabled}
      >
        <SelectTrigger>{field.value || field.placeholder}</SelectTrigger>
        <SelectContent>
          {field.selectOptions?.map((opt, i) => (
            <SelectItem key={`select-${i}-${opt.label}`} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex flex-col justify-start items-start w-full">
      <Input
        id={field.id}
        name={field.id}
        type={field.type}
        placeholder={field.placeholder}
        value={field.value}
        required
        disabled={field.disabled}
        onChange={(e) => {
          field.handleUpdate(e.target.value);
        }}
      />
      {field.desc && (
        <span className="text-xs px-2 pt-1 text-muted-foreground">
          {field.desc}
        </span>
      )}
    </div>
  );
};
