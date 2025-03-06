"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, SettingsIcon, SendIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import { useApiKey } from "@/providers/ai-provider";
import { AiOption, KeyStorePref } from "@/types/ai";
import { AI_OPTIONS_AND_MODELS } from "@/constants/aiSettings";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { PasswordInput } from "@/components/utils/PasswordInput";
import { useToast } from "@/hooks/use-toast";
import { useAiChat } from "@/hooks/useAiChat";
import { SimpleResponse } from "@/types/global";
import Link from "next/link";
import { displayAiOption } from "@/hooks/useAiSettings";

interface ChatHistoryProps {
  messages: string[];
}

interface AiChatProps {
  questionImage: File | null;
  code: string;
  language: string;
}

const AiChat = ({ questionImage, code, language }: AiChatProps) => {
  const {
    prePrompt,
    defaultAiOption,
    defaultAiModel,
    apiKey,
    saveBasicSettings,
    keyPref,
    isSavingPref,
  } = useApiKey();

  const {
    chatHistory,
    prompt,
    setPrompt,
    isPrompting,
    includeCode,
    setIncludeCode,
    includeQuestionImg,
    setIncludeQuestionImg,
    submitPrompt,
  } = useAiChat({
    aiOption: defaultAiOption,
    aiModel: defaultAiModel,
    questionImage,
    code,
    language,
    keyPref: keyPref,
    apiKey: apiKey,
  });

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Prompt context flags */}
      <div className="flex gap-4 items-center pl-2">
        <p className="text-sm font-semibold pr-1">Chat Contexts:</p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="includeQuesImg"
            checked={includeQuestionImg}
            onCheckedChange={() => setIncludeQuestionImg((prev) => !prev)}
          />
          <Label htmlFor="includeQuesImg" className="text-sm">
            Question Img
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
          <AiSettingsModal
            defaultAiModel={defaultAiModel}
            defaultAiOption={defaultAiOption}
            saveBasicSettings={saveBasicSettings}
            keyPref={keyPref}
            isSavingPref={isSavingPref}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatHistory messages={chatHistory} />
      </div>

      <div className="p-4 border-t">
        {isPrompting && (
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              AI brainstorming...
            </span>
          </div>
        )}

        <div className="flex gap-2 items-center relative">
          <div className="relative flex-1">
            <Textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="Ask a question"
              className="resize-none h-[80px]"
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
            {/* <div className="absolute right-2 bottom-0 flex items-center opacity-70">
              <span className="text-xs bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent pr-2">
                Powered By
              </span>
              <Image
                src="/geminiText.svg"
                alt="gemini"
                height={25}
                width={38}
                className="pb-1"
              />
            </div> */}
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

const ChatHistory = ({ messages }: ChatHistoryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to clean message text
  const cleanMessage = (text: string) => {
    return (
      text
        // Replace literal \n with actual newlines
        .replace(/\\n/g, "\n")
        // Remove any extra spaces around newlines
        .trim()
    );
  };

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="space-y-4 p-4">
        {messages.map((m, i) => {
          const fromAI = i % 2 === 0;
          return (
            <div
              className={`flex ${fromAI ? "justify-start" : "justify-end"}`}
              key={`aichat-${i}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl
                                    ${
                                      fromAI
                                        ? "bg-blue-200 text-foreground rounded-tl-none"
                                        : "bg-green-200 text-primary-foreground rounded-br-none"
                                    }
                                `}
              >
                {/* TODO: add font size selector in settings */}
                <ReactMarkdown
                  className="prose max-w-none break-words text-sm
                                        [&>*]:text-current
                                        prose-p:my-1 prose-p:first:mt-0 prose-p:last:mb-0
                                        prose-pre:my-2 
                                        prose-code:text-current
                                        prose-li:my-0"
                  components={{
                    pre: ({ children }) => (
                      <div className="not-prose my-2 w-full">
                        <pre className="bg-card/20 p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                          {children}
                        </pre>
                      </div>
                    ),
                    code: ({ inline, children }: any) =>
                      inline ? (
                        <code className="px-1.5 py-0.5 rounded-md break-words">
                          {children}
                        </code>
                      ) : (
                        <code className="break-words">{children}</code>
                      ),
                  }}
                >
                  {cleanMessage(m)}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

interface AiSettingsModalProps {
  defaultAiOption: AiOption;
  defaultAiModel: string;
  keyPref: KeyStorePref;
  saveBasicSettings: (
    pref: KeyStorePref,
    key: string,
    model: string
  ) => Promise<SimpleResponse>;
  isSavingPref: boolean;
}

const AiSettingsModal = ({
  defaultAiOption,
  defaultAiModel,
  saveBasicSettings,
  keyPref,
  isSavingPref,
}: AiSettingsModalProps) => {
  const { toast } = useToast();

  const [storageOption, setStorageOption] = useState<KeyStorePref>(keyPref);
  const [modelOption, setModelOption] = useState<string>(defaultAiModel);

  useEffect(() => {
    setStorageOption(keyPref);
  }, [keyPref]);

  useEffect(() => {
    setModelOption(defaultAiModel);
  }, [defaultAiModel]);

  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);

      const newApiKey = formData.get("apiKey") as string;

      const success = await saveBasicSettings(
        storageOption,
        newApiKey,
        modelOption
      );
      if (!success) {
        throw new Error("Failed to save storage preference");
      }

      setIsOpen(false);
      toast({ title: "Settings Saved" });
    } catch (error) {
      alert("Failed to save settings");
      console.error("Error saving settings:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="hover:bg-secondary p-2 rounded-md transition-colors">
          <SettingsIcon className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {displayAiOption(defaultAiOption)}'s' Settings
          </DialogTitle>
          <span className="text-sm text-muted-foreground">
            Change to another model{" "}
            <Link
              href="/profile/settings"
              className="text-secondary-foreground hover:underline"
            >
              here
            </Link>
            !
          </span>
        </DialogHeader>

        <form onSubmit={handleSave}>
          <div className="flex flex-col gap-6 py-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="model" className="font-semibold px-0.5">
                {displayAiOption(defaultAiOption)} Model:
              </Label>
              <Select
                value={modelOption}
                defaultValue={modelOption}
                onValueChange={(value: string) => setModelOption(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{modelOption}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {AI_OPTIONS_AND_MODELS[defaultAiOption].map((model, i) => (
                      <SelectItem key={`ai_model-${i}`} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground px-0.5">
                Models may have differing usage cost
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="storage" className="font-semibold px-0.5">
                API Key Store Preference:
              </Label>
              <Select
                value={storageOption}
                defaultValue={keyPref}
                onValueChange={(value: KeyStorePref) =>
                  setStorageOption(value as KeyStorePref)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {storageOption === KeyStorePref.LOCAL
                      ? "Local Storage"
                      : storageOption === KeyStorePref.CLOUD
                      ? "Cloud Storage"
                      : "Select storage option"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={KeyStorePref.LOCAL}>
                      Local Storage
                    </SelectItem>
                    <SelectItem value={KeyStorePref.CLOUD}>
                      Cloud Storage
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground px-0.5">
                {storageOption === KeyStorePref.LOCAL
                  ? "API key will not be stored and cleared after every session."
                  : "API key will be encrypted & stored securely in our database"}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="apiKey" className="font-semibold px-0.5">
                {displayAiOption(defaultAiOption)} API Key:
              </Label>
              <PasswordInput
                id="apiKey"
                name="apiKey"
                parentClassName="relative"
                eyeClassName="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
              />
              <p className="text-sm text-muted-foreground px-0.5">
                For security reasons, your API key is{" "}
                <span className="underline">never</span> displayed (& fetched to
                your browser)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                !storageOption ||
                storageOption === KeyStorePref.UNSET ||
                isSavingPref
              }
              className="w-full sm:w-auto"
            >
              {isSavingPref ? (
                <div className="flex_center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AiChat;
