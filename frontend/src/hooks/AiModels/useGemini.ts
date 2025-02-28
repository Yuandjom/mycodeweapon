"use client";

import { KeyStorePref } from "@/providers/apikey-provider";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_INSTRUCTIONS } from "@/constants/gemini";
import { promptAiParams } from "../useAiChat";

interface UseGeminiProps {
  questionImage: File | null;
  code: string;
  language: string;
  geminiPref: KeyStorePref;
  geminiKey: string | null;
  includeCode: boolean;
  includeQuestionImg: boolean;
}

export const useGemini = ({
  questionImage,
  code,
  language,
  geminiPref,
  geminiKey,
  includeCode,
  includeQuestionImg,
}: UseGeminiProps) => {
  const askGemini = async ({
    prompt,
    setPrompt,
    chatHistory,
  }: promptAiParams): Promise<string> => {
    if (!prompt.trim()) return "You did not send anything";

    const cachedPrompt = prompt;
    setPrompt("");

    // check if there is api key set for local unless user using CLOUD
    if (geminiPref !== KeyStorePref.CLOUD && !geminiKey) {
      return "You have not set an API Key!";
    }

    let context = "";

    if (chatHistory.length === 1) {
      context += GEMINI_INSTRUCTIONS;
    }

    let imageData = null;

    if (includeQuestionImg && questionImage) {
      context += "Question Image: [Image will be processed]\n\n";
      imageData = await convertQuestionImage(questionImage);
    }
    if (includeCode && code) {
      context += `Current Code (language: ${language}):\n${code}\n\n`;
    }

    try {
      let response;

      if (geminiPref === KeyStorePref.CLOUD) {
        // Use server-side API call
        response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: cachedPrompt,
            context,
            chatHistory,
            questionImage: includeQuestionImg ? imageData : null,
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");
        const reply = response.text();

        return reply;
      } else {
        if (!geminiKey) {
          throw new Error("No API key set!");
        }

        console.log("[useGemini] local version with key:", geminiKey);

        // Direct client-side call using local key
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const processedHistory = chatHistory.slice(1).map((m, i) => ({
          role: i % 2 === 0 ? "user" : "model",
          parts: [{ text: m }],
        }));

        const chat = model.startChat({
          history: processedHistory,
          generationConfig: {
            maxOutputTokens: 2048,
          },
        });

        let result;
        if (imageData) {
          const imageBuffer = Buffer.from(imageData.data);
          result = await chat.sendMessage([
            {
              inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: imageData.type,
              },
            },
            {
              text: context ? `${context}\n\n${cachedPrompt}` : cachedPrompt,
            },
          ]);
        } else {
          result = await chat.sendMessage(
            context ? `${context}\n\n${cachedPrompt}` : cachedPrompt
          );
        }

        const reply = result.response.text();

        return reply;
      }
    } catch (err) {
      console.log(err);
      return "I apologize, I am currently unavailable. Try again later!";
    }
  };

  return {
    askGemini,
  };
};

const convertQuestionImage = async (file: File) => {
  try {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    return {
      type: file.type,
      data: Array.from(data), // Convert to regular array for JSON serialization
    };
  } catch (error) {
    console.error("Error converting image:", error);
    return null;
  }
};
