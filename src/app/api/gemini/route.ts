import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface RequestBody {
  aiModel: string;
  prompt: string;
  context: string;
  chatHistory: string[];
  questionImage: {
    type: string;
    data: number[];
  } | null;
}

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing Gemini API key" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const {
      aiModel,
      prompt,
      context,
      chatHistory,
      questionImage,
    }: RequestBody = body;

    const MAX_OUTPUT_TOKENS = 2048;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: aiModel });

    const processedHistory = chatHistory.slice(1).map((m, i) => ({
      role: i % 2 === 0 ? "user" : "model",
      parts: [{ text: m }],
    }));

    const chat = model.startChat({
      history: processedHistory,
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
      },
    });

    let result;
    if (questionImage) {
      const imageBuffer = Buffer.from(questionImage.data);

      result = await chat.sendMessage([
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: questionImage.type,
          },
        },
        {
          text: context ? `${context}\n\n${prompt}` : prompt,
        },
      ]);
    } else {
      // Text-only message
      result = await chat.sendMessage(
        context ? `${context}\n\n${prompt}` : prompt
      );
    }

    const response = result.response;
    console.log("Received response:", response.text());

    return NextResponse.json(response.text(), { status: 200 });
  } catch (err) {
    console.error("Error in Gemini API:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Error processing request",
      },
      { status: 500 }
    );
  }
}
