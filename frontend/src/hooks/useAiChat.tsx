"use client";

import { AiModels } from "@/types/problem";
import { useGemini } from "@/hooks/AiModels/useGemini";
import { KeyStorePref } from "@/providers/apikey-provider";
import { useState } from "react";

const FIRST_MESSAGE: string =
  "Hello! I am your assistant, I am here to help answer your questions!";

interface useAiChatProps {
  questionImage: File | null;
  code: string;
  language: string;
  aiModel: AiModels;
  keyPref: KeyStorePref;
  apiKey: string | null;
}

export interface promptAiParams {
  prompt: string;
  setPrompt: (p: string) => void;
  chatHistory: string[];
}

export const useAiChat = ({
  questionImage,
  code,
  language,
  aiModel,
  keyPref,
  apiKey,
}: useAiChatProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isPrompting, setIsPrompting] = useState<boolean>(false);

  const [chatHistory, setChatHistory] = useState<string[]>([FIRST_MESSAGE]);

  const [includeCode, setIncludeCode] = useState<boolean>(false);
  const [includeQuestionImg, setIncludeQuestionImg] = useState<boolean>(true);

  const { askGemini } = useGemini({
    questionImage,
    code,
    language,
    geminiPref: keyPref,
    geminiKey: apiKey,
    includeCode,
    includeQuestionImg,
  });

  const submitPrompt = async () => {
    try {
      setIsPrompting(true);
      setChatHistory((prev) => [...prev, prompt]);
      const reply = await askGemini({ prompt, setPrompt, chatHistory });

      setChatHistory((prev) => [...prev, reply]);
    } catch (err) {
      console.log("[submitPrompt] error: ", err);
    } finally {
      setIsPrompting(false);
    }
  };

  return {
    chatHistory,
    prompt,
    includeCode,
    setIncludeCode,
    includeQuestionImg,
    setIncludeQuestionImg,
    setPrompt,
    isPrompting,
    submitPrompt,
  };
};
