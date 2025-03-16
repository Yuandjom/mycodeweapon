"use server";
import { AiOption, OpenAiInitParams, AiChatRole } from "@/types/ai";
import { SYSTEM_PROMPT, getAiOptionBaseUrl } from "@/constants/aiSettings";
import { fetchDecryptedApiKey } from "@/app/actions/apiKeys";
import OpenAi from "openai";
import { SimpleDataResponse } from "@/types/global";
import {
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
} from "openai/resources/index.mjs";
import { ProblemContext } from "@/hooks/useAiChat";

interface userCode {
  code: string;
  language: string;
}

interface cloudPromptAiProps {
  userId: string;
  aiOption: AiOption;
  aiModel: string;
  apiKey: string;
  chatMessages: ChatCompletionMessageParam[];
  probContext: ProblemContext | null;
  codeContext: userCode | null;
}

export const cloudPromptAi = async ({
  userId,
  probContext,
  aiOption,
  aiModel,
  apiKey,
  chatMessages,
  codeContext,
}: cloudPromptAiProps): Promise<SimpleDataResponse<string>> => {
  try {
    if (!apiKey) {
      const { data } = await fetchDecryptedApiKey(userId, aiOption);
      apiKey = data;
    }

    // Prepare messages array with system prompt
    const systemMessage = [SYSTEM_PROMPT];

    const contextContent: ChatCompletionMessageParam = {
      role: AiChatRole.User,
      content: [
        {
          type: "text",
          text: "Attached is my question and code (if none received, ignore this message).",
        },
      ],
    };

    if (probContext) {
      (contextContent.content as ChatCompletionContentPart[]).push({
        type: "text",
        text: `This is my problem title:${probContext.title}\nThis is my problem description${probContext.description}\n\`\`\``,
      });
    }

    // Attach the code snippet correctly
    if (codeContext) {
      (contextContent.content as ChatCompletionContentPart[]).push({
        type: "text",
        text: `This is my code:\n\`\`\`${codeContext.language}\n${codeContext.code}\n\`\`\``,
      });
    }

    const sendMessages: ChatCompletionMessageParam[] = [
      { role: AiChatRole.System, content: systemMessage.join("\n\n\n") },
      ...chatMessages.slice(1),
    ];

    if (codeContext) {
      sendMessages.push(contextContent);
    }

    let aiInitParams: OpenAiInitParams = { apiKey };
    if (aiOption !== AiOption.OpenAi) {
      aiInitParams.baseURL = getAiOptionBaseUrl(aiOption);
    }

    const openai = new OpenAi(aiInitParams);
    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: sendMessages,
    });

    const reply = response.choices[0].message.content;

    if (!reply) {
      throw new Error("Reply of length 0 received");
    }

    return {
      success: true,
      message: "Successfully received reply",
      data: reply,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to get reply",
      data: "",
    };
  }
};
