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

    const [chatHistory, SetChatHistory] = useState<string[]>(HARDCODE);

    const [includeCode, setIncludeCode] = useState<boolean>(false);
    const [includeQuestion, setIncludeQuestion] = useState<boolean>(false);

    const submitPrompt = async () => {

        if (!prompt) return;

        setIsPrompting(true);
        setPrompt("")
        SetChatHistory((prev)=>[...prev, prompt])

        try {
            
            const response = await fetch("/api/gemini", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    prompt,
                })
            })
        } catch (err) {

        } finally {
            setIsPrompting(false);
        }

    }



    return {
        chatHistory,
        prompt,
        includeCode,
        setIncludeCode,
        includeQuestion,
        setIncludeQuestion,
        setPrompt,
        isPrompting,
        submitPrompt
    }
}