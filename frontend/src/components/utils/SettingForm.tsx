"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";

export interface SettingFormField {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    initValue: string;
}

interface SettingFormProps {
    fields: SettingFormField[]
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    isSubmitting: boolean
    renderField?: (field: SettingFormField) => React.ReactNode;
    formClassName: string
}

export const SettingForm = ({fields, onSubmit, isSubmitting, renderField, formClassName}: SettingFormProps) => {

    return (
            <form
                onSubmit={onSubmit}
                className={formClassName}
            >
                {fields.map((field)=> {


                    return (
                        <div
                            key={`profileSetting-${field.label}`}
                            className="flex flex-col justify-center items-start gap-1.5"
                        >
                            {field.label && <Label
                                htmlFor={field.id}
                                className="flex justify-end items-center font-semibold text-sm"
                            >
                                {field.label}:
                            </Label>}
                            <div className="flex justify-start items-center w-[200px]">
                            {renderField ? (
                                        renderField(field)
                                    ) : (
                                        <Input
                                            id={field.id}
                                            name={field.id}
                                            type={field.type}
                                            placeholder={field.placeholder || ""}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full"
                                        />
                                    )}

                            </div>
                        </div>
                    )
                })}
            </form>
    )


}