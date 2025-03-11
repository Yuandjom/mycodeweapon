"use server";
import {
  AiOption,
  OpenAiInitParams,
  AiChatMessage,
  AiChatRole,
} from "@/types/ai";
import { SYSTEM_PROMPT, getAiOptionBaseUrl } from "@/constants/aiSettings";
import { fetchDecryptedApiKey } from "@/app/actions/apiKeys";
import OpenAi from "openai";
import { SimpleDataResponse } from "@/types/global";
import {
  ChatCompletionMessageParam,
  ChatCompletionContentPart,
} from "openai/resources/index.mjs";

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
  codeContext: userCode | null;
  imageBase64: string | null;
}

export const cloudPromptAi = async ({
  userId,
  aiOption,
  aiModel,
  apiKey,
  chatMessages,
  codeContext,
  imageBase64,
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
          text: "Attached are my question image and code (if none received, ignore this message).",
        },
      ],
    };

    // Attach the image if it's the first user message
    if (imageBase64) {
      (contextContent.content as ChatCompletionContentPart[]).push({
        type: "image_url",
        image_url: { url: `data:image/png;base64,${imageBase64}` },
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

    if (imageBase64 || codeContext) {
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
