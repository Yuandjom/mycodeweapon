"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button"
import { useGemini } from "@/hooks/useGemini"
import { Loader2 } from "lucide-react"

interface ChatHistoryProps {
    messages: string[]
}

interface AiChatProps {
    questionImage: File | null
    code: string
    language: string
}

const AiChat = ({questionImage, code, language} : AiChatProps) => {

    const { chatHistory, prompt, setPrompt, isPrompting,
            includeCode, setIncludeCode, includeQuestion, setIncludeQuestion, submitPrompt } = useGemini({  questionImage, code, language })

    return (
        <div className="w-full h-full">

            <ChatHistory messages={chatHistory} />
            {isPrompting && <Loader2 className="animate-spin"/>}
            <Textarea
                disabled={isPrompting}
                onChange={(e)=>{setPrompt(e.target.value)}}
                value={prompt}
            />

            <Button onClick={submitPrompt}>
                Submit
            </Button>

        </div>
    )

}

export default AiChat

const ChatHistory = ( { messages } : ChatHistoryProps) => {

    return (
        <div className="w-full">
            {messages.map((m, i) => {

                // ai message
                if (i % 2 == 0) {
                    return (
                        <p className="rounded-r bg-secondary border-1 border-black text-left">{m}</p>
                    )

                // user message
                } else {
                    return (
                        <p className="rounded-l bg-secondary border-1 border-black text-right">{m}</p>
                    )
                }
            })}
        </div>
    )
}