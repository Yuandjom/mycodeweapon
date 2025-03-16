"use client";

import { AiOption } from "@/types/ai";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, SendIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useAiChat } from "@/hooks/useAiChat";
import ChatMessages from "./ChatMessages";
import { ProblemState } from "@/types/problem";
import { judge0ToMonacoMap } from "@/constants/judge0";
import ModelSelector from "./ModelSelector";
import ChatSettingsModal from "./ChatSettingsModal";
import {
  DEFAULT_AI_OPTION,
  DEFAULT_AI_MODEL,
  AI_OPTION_STORAGE,
  AI_MODEL_STORAGE,
  AI_OPTIONS_KEY_STORAGE,
  displayAiModel,
  displayAiOption,
} from "@/constants/aiSettings";
import { useToast } from "@/hooks/use-toast";

interface AiChatProps {
  userId: string;
  problemStates: ProblemState;
}

const AiChat = ({ userId, problemStates }: AiChatProps) => {
  const language = judge0ToMonacoMap[problemStates.languageId] || "python";
  const { toast } = useToast();

  const [defaultAiOption, setDefaultAiOption] =
    useState<AiOption>(DEFAULT_AI_OPTION);
  const [defaultAiModel, setDefaultAiModel] =
    useState<string>(DEFAULT_AI_MODEL);

  useEffect(() => {
    const prevDefaultAiOption = localStorage.getItem(AI_OPTION_STORAGE);
    if (prevDefaultAiOption) {
      setDefaultAiModel(prevDefaultAiOption);
    }

    const prevDefaultAiModel = localStorage.getItem(AI_MODEL_STORAGE);
    if (prevDefaultAiModel) {
      setDefaultAiModel(prevDefaultAiModel);
    }
  });

  const {
    aiChatHistory,
    prompt,
    setPrompt,
    isPrompting,
    includeCode,
    setIncludeCode,
    includeProblem,
    setIncludeProblem,
    submitPrompt,
  } = useAiChat({
    userId,
    aiOption: defaultAiOption,
    aiModel: defaultAiModel,
    title: problemStates.title,
    description: problemStates.description,
    code: problemStates.code,
    language,
  });

  const handleSelectAi = (aiOption: AiOption, aiModel: string) => {
    setDefaultAiModel(aiModel);
    setDefaultAiOption(aiOption);

    localStorage.setItem(AI_OPTION_STORAGE, aiOption);
    localStorage.setItem(AI_MODEL_STORAGE, aiModel);

    const aiOptionKey = localStorage.getItem(AI_OPTIONS_KEY_STORAGE[aiOption]);

    if (!aiOptionKey) {
      toast({
        title: `${displayAiOption(aiOption)} API key not set!`,
        description: "You can't chat until it's set!",
        action: (
          <Button variant="outline" onClick={() => setOpenModal(true)}>
            Set API Key
          </Button>
        ),
      });
    }
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex flex-col h-full w-full gap-2 relative">
      {/* Prompt context flags */}
      <div className="flex gap-2 items-center">
        <ChatSettingsModal openModal={openModal} />
        <p className="text-sm font-semibold pr-1">Chat Contexts:</p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="includeProblem"
            checked={includeProblem}
            onCheckedChange={() => setIncludeProblem((prev) => !prev)}
          />
          <Label htmlFor="includeProblem" className="text-sm">
            Question
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="includeCode"
            checked={includeCode}
            onCheckedChange={() => setIncludeCode((prev) => !prev)}
          />
          <Label htmlFor="includeCode" className="text-sm">
            Code
          </Label>
        </div>

        <div className="flex-1 flex justify-end">
          <ModelSelector
            onModelSelect={handleSelectAi}
            selectedProvider={defaultAiOption}
            selectedModel={defaultAiModel}
          />
        </div>
      </div>

      {/* Chat messages container with proper overflow handling */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <ChatMessages aiOption={defaultAiOption} messages={aiChatHistory} />
      </div>

      <div className="p-4 border-t w-full">
        {isPrompting && (
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              AI brainstorming...
            </span>
          </div>
        )}

        <div className="flex gap-2 items-center w-full">
          <div className="relative flex-1">
            <Textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="Ask a question"
              className="resize-none h-[60px]"
              disabled={isPrompting}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  prompt.trim().length !== 0
                ) {
                  e.preventDefault();
                  submitPrompt();
                }
              }}
            />
          </div>
          <Button
            onClick={submitPrompt}
            disabled={isPrompting || prompt.trim().length === 0}
            className="bg-slate-50 disabled:bg-slate-100 h-[40px]"
          >
            <SendIcon className="h-16 w-16" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
