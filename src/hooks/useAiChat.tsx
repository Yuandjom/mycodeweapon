"use client";

import { AiChatMessage, AiOption, AiChatRole, KeyStorePref } from "@/types/ai";
import { useState, useEffect } from "react";
import { FIRST_MESSAGE, AI_OPTIONS_KEY_STORAGE } from "@/constants/aiSettings";
import { cloudPromptAi } from "@/actions/prompting";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface useAiChatProps {
  userId: string;
  title: string;
  description: string;
  code: string;
  language: string;
  aiOption: AiOption;
  aiModel: string;
}

export interface promptAiParams {
  aiModel: string;
  prompt: string;
  chatHistory: string[];
  includeCode: boolean;
  includeQuestionImg: boolean;
}

export interface ProblemContext {
  title: string;
  description: string;
}

export const useAiChat = ({
  userId,
  title,
  description,
  code,
  language,
  aiOption,
  aiModel,
}: useAiChatProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isPrompting, setIsPrompting] = useState<boolean>(false);

  const [aiChatHistory, setAiChatHistory] = useState<
    ChatCompletionMessageParam[]
  >([{ role: AiChatRole.Ai, content: FIRST_MESSAGE }]);

  const [includeCode, setIncludeCode] = useState<boolean>(true);
  const [includeProblem, setIncludeProblem] = useState<boolean>(true);

  const probContext: ProblemContext = {
    title,
    description,
  };

  const submitPrompt = async () => {
    try {
      setIsPrompting(true);
      const cachedPrompt: string = prompt;
      const chatMessages: ChatCompletionMessageParam[] = [
        ...aiChatHistory,
        {
          role: AiChatRole.User,
          content: cachedPrompt,
        },
      ];
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: AiChatRole.User,
          content: cachedPrompt,
        },
      ]);
      setPrompt("");

      const apiKey = localStorage.getItem(AI_OPTIONS_KEY_STORAGE[aiOption]);

      const {
        success,
        message,
        data: reply,
      } = await cloudPromptAi({
        userId,
        probContext: includeProblem ? probContext : null,
        aiOption,
        aiModel,
        apiKey: apiKey || "",
        chatMessages,
        codeContext: includeCode ? { code, language } : null,
      });

      if (!success) throw new Error(message);

      setAiChatHistory((prev) => [
        ...prev,
        {
          role: AiChatRole.Ai,
          content: reply,
        },
      ]);
    } catch (err) {
      console.log("[submitPrompt] error: ", err);
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: AiChatRole.Ai,
          content: "Sorry I am busy at the moment, please try again later!",
        },
      ]);
    } finally {
      setIsPrompting(false);
    }
  };

  return {
    aiChatHistory,
    prompt,
    includeCode,
    setIncludeCode,
    includeProblem,
    setIncludeProblem,
    setPrompt,
    isPrompting,
    submitPrompt,
  };
};
