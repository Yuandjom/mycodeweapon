"use client"

import { PasswordInput } from "@/components/utils/PasswordInput"
import { useState } from "react"
import { Input } from "@/components/ui/input";
import { SettingForm, SettingFormField } from "@/components/utils/SettingForm";

const ProfileSettingsForm = () => {

    const [isSaving, setIsSaving] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true)
        try {
            alert("TODO")
        } catch (err) {
            alert(err)
        } finally {
            setIsSaving(true);
        }
    }

    const renderField = (field: SettingFormField) => {
        if (field.type === "password") {
            return (
                <PasswordInput
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    required
                    disabled={isSaving}
                    parentClassName="col-span-2 flex justify-start items-center w-full relative"
                    eyeClassName="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                />
            );
        }

        return (
            <Input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                required
                disabled={isSaving}
            />
        );
    };

    const fields : SettingFormField[] = [
        {
            id: "username",
            label: "Username",
            type: "text",
            initValue: "TODO current username",
        },
        {
            id: "email",
            label: "Email",
            type: "email",
            initValue: "TODO current email",
        },
        {
            id: "password",
            label: "Password",
            type: "password",
            initValue: "",
        }
    ]

    return (
        <SettingForm
            fields={fields}
            onSubmit={handleSubmit}
            isSubmitting={isSaving}
            renderField={renderField}
            formClassName="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        />
    )

}

export default ProfileSettingsForm