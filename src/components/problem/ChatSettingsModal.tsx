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
import { KeyIcon, Loader2, Settings, Shield, Zap } from "lucide-react";
import {
  AI_OPTIONS_AND_MODELS,
  displayAiOption,
  AI_OPTIONS_KEY_STORAGE,
} from "@/constants/aiSettings";
import { AiOption } from "@/types/ai";
import { cn } from "@/lib/utils";

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
    <Button
      variant="outline"
      size="icon"
      title="AI Chat Settings"
      className="border-teal-500/30 hover:bg-teal-500/10 text-teal-600 dark:text-teal-400"
    >
      <Settings className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] min-h-[600px] flex flex-col justify-start items-start border-teal-500/30 bg-background/95 backdrop-blur-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-green-500"></div>

        <DialogHeader className="w-full border-b border-teal-500/20 pb-4">
          <DialogTitle className="text-xl font-bold flex items-center text-teal-600 dark:text-teal-400">
            <Shield className="mr-2 h-5 w-5" />
            AI Model Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value as AiOption)}
          className="flex-auto h-full w-full pt-4"
        >
          <TabsList className="grid grid-cols-5 mb-6 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm p-1 border border-teal-500/20 rounded-md">
            {Object.values(AiOption).map((provider) => (
              <TabsTrigger
                key={provider}
                value={provider}
                className={cn(
                  "flex items-center justify-center data-[state=active]:bg-gradient-to-b data-[state=active]:from-teal-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md relative overflow-hidden",
                  "transition-all duration-200 ease-out"
                )}
              >
                <div className="relative z-10 flex items-center justify-center">
                  <Image
                    src={`/companyIcons/${provider.toLowerCase()}.svg`}
                    alt={displayAiOption(provider)}
                    height={20}
                    width={20}
                    className="filter dark:brightness-110"
                  />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.values(AiOption).map((provider) => (
            <TabsContent
              key={provider}
              value={provider}
              className="space-y-4 animate-in fade-in-50 duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-medium text-teal-600 dark:text-teal-400 flex items-center">
                  <KeyIcon className="mr-2 h-5 w-5" />
                  {displayAiOption(provider)} API Key:
                </h3>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`${provider}-key`}
                  className="text-green-600 dark:text-green-400"
                >
                  API Key
                </Label>
                <div className="relative">
                  <Input
                    id={`${provider}-key`}
                    type="password"
                    value={apiKeys[provider]}
                    onChange={(e) =>
                      handleApiKeyChange(provider, e.target.value)
                    }
                    className="border-teal-500/30 focus-visible:ring-teal-500/40 pr-10 backdrop-blur-sm bg-background/80"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Shield className="h-4 w-4 text-teal-500/50" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400 flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Available Models:
                </h4>
                <div className="rounded-md p-3 border border-teal-500/20 bg-slate-100/30 dark:bg-slate-800/30 backdrop-blur-sm">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {AI_OPTIONS_AND_MODELS[provider].map((model) => (
                      <li key={model} className="text-foreground">
                        {model}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex w-full mt-6 pt-4 border-t border-teal-500/20">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="ml-auto bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-500 hover:to-green-500 text-white border-none shadow-md shadow-teal-500/20 transition-all duration-200"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatSettingsModal;
