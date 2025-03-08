"use server";
import { AiOption, OpenAiInitParams, AiChatMessage } from "@/types/ai";
import { SYSTEM_PROMPT, getAiOptionBaseUrl } from "@/constants/aiSettings";
import { fetchDecryptedApiKey } from "@/app/actions/apiKeys";
import OpenAi from "openai";
import { SimpleDataResponse } from "@/types/global";

interface userCode {
  code: string;
  language: string;
}

interface cloudPromptAiProps {
  userId: string;
  aiOption: AiOption;
  aiModel: string;
  apiKey: string;
  chatMessages: AiChatMessage[];
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

    // Include any code context at the beginning if provided
    if (codeContext) {
      systemMessage.push(
        `The user is working with the following code in ${codeContext.language}:\n\`\`\`${codeContext.language}\n${codeContext.code}\n\`\`\``
      );
    }

    if (imageBase64) {
      systemMessage.push(
        `The user is working with the following question provided as an image (formatted for base64 only for you): ${imageBase64}`
      );
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
    const response = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "system", content: systemMessage.join("\n\n\n") },
        ...chatMessages.slice(1),
      ],
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
