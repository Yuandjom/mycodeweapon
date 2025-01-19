import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai"



export async function POST(req: NextApiRequest, res: NextApiResponse) {

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json('Login to upload.');
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Explain how AI works";
        const result = await model.generateContent(prompt);

        return res.status(200).json(result.response.text());

    } catch (err) {
        return res.status(500).json("Error in polling gemini")
    }


}