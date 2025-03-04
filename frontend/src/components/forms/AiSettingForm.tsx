"use client";

import { PasswordInput } from "@/components/utils/PasswordInput";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SettingForm, SettingFormField } from "@/components/utils/SettingForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeyStorePref } from "@/types/ai";

interface aiStateType {
  geminiKey: string;
  geminiStore: KeyStorePref;
}

const STORAGE_OPTIONS = [
  { label: "Local Storage", value: KeyStorePref.LOCAL },
  { label: "Cloud Storage", value: KeyStorePref.CLOUD },
];

interface AiSettingsFormProps {
  aiKeysState: aiStateType;
  updateGeminiKey: (geminiKey: string) => void;
  updateGeminiStore: (geminiStore: string) => void;
  isSaving: boolean;
}

const AiSettingsForm = ({
  aiKeysState,
  updateGeminiKey,
  updateGeminiStore,
  isSaving,
}: AiSettingsFormProps) => {
  const renderField = (field: SettingFormField) => {
    switch (field.type) {
      case "password":
        return (
          <PasswordInput
            id={field.id}
            name={field.id}
            placeholder={field.placeholder}
            required
            disabled={isSaving}
            parentClassName="col-span-2 flex justify-start items-center w-full relative"
            eyeClassName="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
            handleUpdate={updateGeminiKey}
          />
        );
      case "select":
        return (
          <Select
            defaultValue={field.initValue}
            onValueChange={(value) => updateGeminiStore(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {STORAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={field.placeholder}
            required
            disabled={isSaving}
            onChange={(e) => {
              console.log("changing input: ", e.target.value);
              field.handleUpdate(e.target.value);
            }}
          />
        );
    }
  };

  const createAiFields = (prefix: string): SettingFormField[] => [
    {
      id: `${prefix}_storageOption`,
      label: "",
      type: "select",
      initValue: "LOCAL",
      handleUpdate: updateGeminiStore,
    },
    {
      id: `${prefix}_apikey`,
      label: "",
      type: "password",
      initValue: "",
      placeholder: "Enter your API key",
      handleUpdate: updateGeminiKey,
    },
  ];

  const aiProviders = [
    {
      cmgSoon: false,
      title: "Gemini",
      prefix: "gemini",
      icon: "/companyIcons/gemini.svg",
    },
    // { cmgSoon: true, title: "OpenAI", prefix: "openai", icon: "/companyIcons/openai.svg" },
    // { cmgSoon: true, title: "Deepseek", prefix: "deepseek", icon: "/companyIcons/deepseek.svg" },
    // { cmgSoon: true, title: "Claude", prefix: "claude", icon: "/companyIcons/claude.svg" },
  ];

  return (
    <div className="w-full space-y-12">
      {aiProviders.map((provider) => (
        <div className="flex_center gap-8">
          <div className="w-[60px] flex_col_center gap-1">
            <Image
              alt={provider.title}
              src={provider.icon}
              height={20}
              width={20}
            />
            <span className="text-xs text-center text-muted-foreground">
              {provider.title}
            </span>
          </div>
          {provider.cmgSoon ? (
            <div className="w-full ">
              <span className="ml-3 px-2 py-1 font-bold text-xs rounded-full bg-amber-600 text-gray-100">
                Coming Soon!
              </span>
            </div>
          ) : (
            <SettingForm
              key={provider.prefix}
              fields={createAiFields(provider.prefix)}
              isSubmitting={isSaving}
              renderField={renderField}
              formClassName="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AiSettingsForm;
