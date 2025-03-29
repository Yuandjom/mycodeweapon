import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyIcon, Loader2 } from "lucide-react";
import {
  AI_OPTIONS_AND_MODELS,
  displayAiOption,
  AI_OPTIONS_KEY_STORAGE,
} from "@/constants/aiSettings";
import { AiOption } from "@/types/ai";

interface ChatSettingsModalProps {
  trigger?: React.ReactNode;
  openModal: boolean;
}

export function ChatSettingsModal({
  trigger,
  openModal,
}: ChatSettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AiOption>(AiOption.OpenAi);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setOpen(openModal);
  }, [openModal]);

  // API Keys state - one for each provider
  const [apiKeys, setApiKeys] = useState<Record<AiOption, string>>({
    [AiOption.OpenAi]: "",
    [AiOption.Gemini]: "",
    [AiOption.Claude]: "",
    [AiOption.DeepSeek]: "",
    [AiOption.Perplexity]: "",
  });

  // Load saved keys from localStorage on component mount
  useEffect(() => {
    const keys = { ...apiKeys };

    Object.entries(AI_OPTIONS_KEY_STORAGE).forEach(([option, storageKey]) => {
      keys[option as AiOption] = localStorage.getItem(storageKey) || "";
    });

    setApiKeys(keys);
  }, []);

  // Handle API key change for a specific provider
  const handleApiKeyChange = (provider: AiOption, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [provider]: value,
    }));
  };

  // Handle saving all settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    // Save all API keys to localStorage
    Object.entries(AI_OPTIONS_KEY_STORAGE).forEach(([option, storageKey]) => {
      localStorage.setItem(storageKey, apiKeys[option as AiOption]);
    });

    // Close modal after saving
    setIsSaving(false);
    setOpen(false);
  };

  // Default trigger if none provided
  const defaultTrigger = (
    <Button variant="outline" size="icon" title="AI Chat Settings">
      <KeyIcon className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] min-h-[600px] flex flex-col justify-start items-start">
        <DialogHeader>
          <DialogTitle>AI Model Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as AiOption)}
          className="flex-auto h-full w-full"
        >
          <TabsList className="grid grid-cols-5 mb-4">
            {Object.values(AiOption).map((provider) => (
              <TabsTrigger
                key={provider}
                value={provider}
                className="flex items-center justify-center"
              >
                <Image
                  src={`/companyIcons/${provider.toLowerCase()}.svg`}
                  alt={displayAiOption(provider)}
                  height={20}
                  width={20}
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.values(AiOption).map((provider) => (
            <TabsContent key={provider} value={provider} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-medium">
                  {displayAiOption(provider)} API Key:
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${provider}-key`}>API Key</Label>
                <Input
                  id={`${provider}-key`}
                  type="password"
                  value={apiKeys[provider]}
                  onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                />
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Available Models:</h4>
                <div className="rounded-md p-3">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {AI_OPTIONS_AND_MODELS[provider].map((model) => (
                      <li key={model}>{model}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex w-full">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="ml-auto"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatSettingsModal;
