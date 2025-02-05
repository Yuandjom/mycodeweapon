"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";

export interface SettingFormField {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    initValue: string;
    handleUpdate: (val: string) => void;
}

interface SettingFormProps {
    fields: SettingFormField[]
    isSubmitting: boolean
    renderField?: (field: SettingFormField) => React.ReactNode;
    formClassName: string
}

export const SettingForm = ({fields, isSubmitting, renderField, formClassName}: SettingFormProps) => {
    return (
            <div
                className={formClassName}
            >
                {fields.map((field, i)=> {
                    console.log("rendering field: ", field)
                    return (
                        <div
                            key={`profileSetting-${field.id}-${i}`}
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
                                            placeholder=""
                                            value={field.initValue}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full"
                                            onChange={(e)=>{
                                                console.log("changing input: ", e.target.value)
                                                field.handleUpdate(e.target.value)
                                            }}
                                        />
                                    )}

                            </div>
                        </div>
                    )
                })}
            </div>
    )


}