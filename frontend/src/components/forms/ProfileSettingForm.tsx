"use client";
import { SettingForm, SettingFormField } from "@/components/utils/SettingForm";

interface ProfileSettingsFormProps {
  username: string;
  email: string;
  password: string;
  updateUsername: (username: string) => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
  isSaving: boolean;
}

const ProfileSettingsForm = ({
  username,
  email,
  password,
  updateUsername,
  updateEmail,
  updatePassword,
  isSaving,
}: ProfileSettingsFormProps) => {
  const fields: SettingFormField[] = [
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "",
      value: username,
      handleUpdate: updateUsername,
      disabled: isSaving,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      desc: "You will need to confirm change on both emails for security",
      placeholder: "",
      value: email,
      handleUpdate: updateEmail,
      disabled: isSaving,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      value: password,
      placeholder: "*********",
      handleUpdate: updatePassword,
      disabled: isSaving,
    },
  ];

  return (
    <SettingForm
      fields={fields}
      isSubmitting={isSaving}
      formClassName="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    />
  );
};

export default ProfileSettingsForm;
