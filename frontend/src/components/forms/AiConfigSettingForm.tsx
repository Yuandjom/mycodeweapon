"use client";

import { AiOption } from "@/types/ai";
import {
  AI_OPTIONS_AND_MODELS,
  displayAiOption,
  displayAiModel,
} from "@/constants/aiSettings";
import { SettingForm, SettingFormField } from "@/components/utils/SettingForm";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AiConfigSettingFormProps {
  prePrompt: string;
  defaultAiOption: AiOption;
  defaultAiModel: string;
  updatePrePrompt: (prePrompt: string) => void;
  updateDefaultAiOption: (aiOption: AiOption) => void;
  updateDefaultAiModel: (aiModel: string) => void;
  isSaving: boolean;
}

const AiConfigSettingForm = ({
  prePrompt,
  defaultAiOption,
  defaultAiModel,
  updatePrePrompt,
  updateDefaultAiOption,
  updateDefaultAiModel,
  isSaving,
}: AiConfigSettingFormProps) => {
  const aiOptionSelections = Object.values(AiOption).map((opt) => ({
    value: opt,
    label: displayAiOption(opt),
  }));

  const aiModelSelections = AI_OPTIONS_AND_MODELS[defaultAiOption].map(
    (mod) => ({
      value: mod,
      label: displayAiModel(mod),
    })
  );

  const handleAiOptionUpdate = (val: any) => {
    updateDefaultAiOption(val);
    updateDefaultAiModel("");
  };

  const fields: SettingFormField[] = [
    {
      id: "aiOptions",
      label: "Default AI",
      type: "select",
      placeholder: "",
      value: displayAiOption(defaultAiOption),
      handleUpdate: handleAiOptionUpdate,
      disabled: isSaving,
      selectOptions: aiOptionSelections,
    },
    {
      id: "aiModel",
      label: "Default Model",
      type: "select",
      placeholder: "Select AI Model",
      value: defaultAiModel,
      displayValue: displayAiModel,
      handleUpdate: updateDefaultAiModel,
      disabled: isSaving,
      selectOptions: aiModelSelections,
    },
  ];

  return (
    <div className="flex flex-col gap-6 justify-center items-start">
      <SettingForm
        fields={fields}
        isSubmitting={isSaving}
        formClassName="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      />

      <div className="w-full flex flex-col justify-center items-start gap-2">
        <div className="flex flex-col justify-center items-start px-1">
          <Label
            htmlFor="preprompt"
            className="flex justify-end items-center font-semibold text-sm"
          >
            Pre-prompt
          </Label>
          <span className="text-muted-foreground text-sm">
            This sets the context to your AI model
          </span>
        </div>

        <Textarea
          id="preprompt"
          disabled={isSaving}
          value={prePrompt}
          className="h-[180px]"
          onChange={(e) => {
            updatePrePrompt(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default AiConfigSettingForm;
