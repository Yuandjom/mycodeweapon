"use client"

import { PasswordInput } from "@/components/utils/PasswordInput"
import { useState } from "react"
import { Input } from "@/components/ui/input";
import { SettingForm, SettingFormField } from "@/components/utils/SettingForm";

interface ProfileSettingsFormProps {
    username: string,
    email: string,
    password: string,
    updateUsername: (username: string) => void,
    updateEmail: (email: string) => void,
    updatePassword: (password: string) => void,
    isSaving: boolean
}

const ProfileSettingsForm = ({
    username, email, password,
    updateUsername, updateEmail,
    updatePassword, isSaving} : ProfileSettingsFormProps) => {

    const renderField = (field: SettingFormField) => {
        if (field.type === "password") {
            return (
                <PasswordInput
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={field.initValue}
                    required
                    disabled={isSaving}
                    parentClassName="col-span-2 flex justify-start items-center w-full relative"
                    eyeClassName="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    handleUpdate={updatePassword}
                />
            );
        }

        return (
            <Input
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={field.initValue}
                required
                disabled={isSaving}
                onChange={(e)=>{
                    console.log("changing input: ", e.target.value)
                    field.handleUpdate(e.target.value)
                }}
            />
        );
    };

    const fields : SettingFormField[] = [
        {
            id: "username",
            label: "Username",
            type: "text",
            placeholder: "",
            initValue: username,
            handleUpdate: updateUsername
        },
        {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "",
            initValue: email,
            handleUpdate: updateEmail
        },
        {
            id: "password",
            label: "Password",
            type: "password",
            initValue: password,
            placeholder: "*********",
            handleUpdate: updatePassword
        }
    ]

    return (
        <SettingForm
            fields={fields}
            isSubmitting={isSaving}
            renderField={renderField}
            formClassName="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        />
    )

}

export default ProfileSettingsForm