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
  chatHistory: string[];
  includeCode: boolean;
  includeQuestionImg: boolean;
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
  });

  const submitPrompt = async () => {
    try {
      setIsPrompting(true);
      const cachedPrompt: string = prompt;
      setChatHistory((prev) => [...prev, cachedPrompt]);
      setPrompt("");

      const reply = await askGemini({
        prompt: cachedPrompt,
        chatHistory,
        includeCode,
        includeQuestionImg,
      });

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
