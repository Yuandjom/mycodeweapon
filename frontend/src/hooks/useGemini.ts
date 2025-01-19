"use client"

import { useState } from "react"

interface SubmitPromptParams {
    prompt: string
}

const HARDCODE = [
    "Hello! Do you need any help?",
    "What is your name?",
    "I am Gemini, I am here to help answer your questions",
]

interface UseGeminiProps {
    questionImage: File | null
    code: string
    language: string
}

export const useGemini = ({questionImage, code, language} : UseGeminiProps) => {

    const [prompt, setPrompt] = useState<string>("");
    const [isPrompting, setIsPrompting] = useState<boolean>(false);

    const [chatHistory, setChatHistory] = useState<string[]>(HARDCODE);

    const [includeCode, setIncludeCode] = useState<boolean>(false);
    const [includeQuestionImg, setIncludeQuestionImg] = useState<boolean>(false);

    const submitPrompt = async () => {

        if (!prompt.trim()) return;

        
        setIsPrompting(true);
        setChatHistory((prev)=>[...prev, prompt])
        const cachedPrompt = prompt;
        setPrompt("")

        let context = ""
        if (includeQuestionImg && questionImage) {
            context += "Question Image: [Image will be processed]\n\n"
        }
        if (includeCode && code) {
            context += `Current Code (language: ${language}):\n${code}\n\n`
        }

        try {
            
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    prompt: cachedPrompt,
                    context,
                    chatHistory,
                    questionImage: includeQuestionImg ? questionImage : null
                })
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const reply = await response.text();
            setChatHistory((prev) => [...prev, reply])
            
        } catch (err) {
            console.log(err);
            setChatHistory((prev) => [...prev, "I apologize, I am currently unavailable. Try again later!"])
        } finally {
            setIsPrompting(false);
        }

    }



    return {
        chatHistory,
        prompt,
        includeCode,
        setIncludeCode,
        includeQuestionImg,
        setIncludeQuestionImg,
        setPrompt,
        isPrompting,
        submitPrompt
    }
}