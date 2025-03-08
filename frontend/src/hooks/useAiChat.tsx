"use client";

import {
  AiChatMessage,
  AiOption,
  AiChatRole,
  KeyStorePref,
  OpenAiInitParams,
} from "@/types/ai";
import { useState } from "react";
import {
  FIRST_MESSAGE,
  getAiOptionBaseUrl,
  SYSTEM_PROMPT,
} from "@/constants/aiSettings";
import { cloudPromptAi } from "@/actions/prompting";
import OpenAi from "openai";

interface useAiChatProps {
  userId: string;
  questionImage: File | null;
  code: string;
  language: string;
  aiOption: AiOption;
  aiModel: string;
  storePref: KeyStorePref;
  apiKey: string | null;
}

export interface promptAiParams {
  aiModel: string;
  prompt: string;
  chatHistory: string[];
  includeCode: boolean;
  includeQuestionImg: boolean;
}

export const useAiChat = ({
  userId,
  questionImage,
  code,
  language,
  aiOption,
  aiModel,
  storePref,
  apiKey,
}: useAiChatProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isPrompting, setIsPrompting] = useState<boolean>(false);

  const [aiChatHistory, setAiChatHistory] = useState<AiChatMessage[]>([
    { role: AiChatRole.Ai, content: FIRST_MESSAGE },
  ]);

  const [includeCode, setIncludeCode] = useState<boolean>(false);
  const [includeQuestionImg, setIncludeQuestionImg] = useState<boolean>(true);

  const submitPrompt = async () => {
    let reply = "";
    try {
      setIsPrompting(true);
      const cachedPrompt: string = prompt;
      const chatMessages = [
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

      if (storePref === KeyStorePref.CLOUD) {
        const { success, message, data } = await cloudPromptAi({
          userId,
          aiOption,
          aiModel,
          chatMessages,
        });

        reply = data;

        if (!success) throw new Error(message);
      } else {
        if (!apiKey) {
          throw new Error("No API Key set");
        }

        let aiInitParams: OpenAiInitParams = {
          apiKey,
        };
        if (aiOption !== AiOption.OpenAi) {
          aiInitParams = {
            ...aiInitParams,
            baseURL: getAiOptionBaseUrl(aiOption),
          };
        }
        const openai = new OpenAi(aiInitParams);

        const completion = await openai.chat.completions.create({
          model: aiModel,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...aiChatHistory,
          ],
        });

        reply = completion.choices[0].message.content || "";
      }
      if (!reply) {
        throw new Error("Reply of length 0 received");
      }
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: AiChatRole.Ai,
          content: reply,
        },
      ]);
    } catch (err) {
      console.log("[submitPrompt] error: ", err);
    } finally {
      setIsPrompting(false);
    }
  };

  return {
    aiChatHistory,
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
