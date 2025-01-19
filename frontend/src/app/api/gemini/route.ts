import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"

interface RequestBody {
    prompt: string
    context: string
    chatHistory: string[]
    questionImage: File | null
}

export async function POST(req: NextRequest) {

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
            { error: "Missing Gemini API key"},
            { status: 500},
        )
    }

    try {

        const body = await req.json()
        console.log(body);

        const { prompt, context, chatHistory, questionImage } : RequestBody  = body

        //todo: add config settings on user side
        const MAX_OUTPUT_TOKENS = 2048

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"})


        const processedHistory = chatHistory.slice(1).map((m, i) => ({
            role: i % 2 === 0 ? "user" : "model",
            parts: [{ text: m }],
        }))

        console.log("processed history")
        console.log(processedHistory);

        const chat = model.startChat({
            history: processedHistory,
            generationConfig: {
                maxOutputTokens: MAX_OUTPUT_TOKENS
            }
        })

        const finalisedPrompt = context ? `${context}\n\n${prompt}` : prompt

        console.log("finalised prompt:")
        console.log(finalisedPrompt);

        const result = await chat.sendMessage(finalisedPrompt)

        const response = result.response;

        console.log("Received response:")
        console.log(response)
        
        return NextResponse.json(
            response.text(),
            { status: 200}
        )

    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Error processing request"},
            { status: 500}
        )
    }


}