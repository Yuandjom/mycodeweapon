"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiOption } from "@/types/ai";
import {
  AI_OPTIONS_AND_MODELS,
  displayAiOption,
  displayAiModel,
} from "@/constants/aiSettings";

interface ModelSelectorProps {
  onModelSelect: (provider: AiOption, model: string) => void;
  selectedProvider?: AiOption;
  selectedModel?: string;
}

export default function ModelSelector({
  onModelSelect,
  selectedProvider = AiOption.OpenAi,
  selectedModel = "gpt-4-turbo",
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Set initial provider and model
  useEffect(() => {
    if (selectedProvider && selectedModel) {
      // Format the value as "provider:model"
      setValue(`${selectedProvider}:${selectedModel}`);
    }
  }, [selectedProvider, selectedModel]);

  // Get available models for display and filtering
  const allModels = Object.entries(AI_OPTIONS_AND_MODELS).flatMap(
    ([provider, models]) => {
      return models.map((model) => ({
        provider: provider as AiOption,
        value: `${provider}:${model}`,
        label: model,
      }));
    }
  );

  // Get display name for the currently selected model
  const getDisplayValue = () => {
    const selectedValue = allModels.find((item) => item.value === value);
    if (!selectedValue) {
      return displayAiModel(selectedModel);
    }
    return displayAiModel(selectedValue.label);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=""
        >
          {getDisplayValue()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandList>
            {Object.entries(AI_OPTIONS_AND_MODELS).map(([provider, models]) => (
              <CommandGroup
                key={provider}
                heading={displayAiOption(provider as AiOption)}
              >
                {models.map((model) => {
                  const itemValue = `${provider}:${model}`;
                  return (
                    <CommandItem
                      key={itemValue}
                      value={itemValue}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        const [providerKey, modelName] =
                          currentValue.split(":");
                        onModelSelect(providerKey as AiOption, modelName);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === itemValue ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {displayAiModel(model)}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
