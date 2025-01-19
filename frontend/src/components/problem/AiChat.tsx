"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useGemini } from "@/hooks/useGemini"
import { Loader2, Send } from "lucide-react"
import { useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"

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
            includeCode, setIncludeCode, includeQuestionImg, setIncludeQuestionImg, submitPrompt } = useGemini({  questionImage, code, language })

    return (
        <div className="flex flex-col h-full gap-4">
            
            {/* Prompt context flags */}
            <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="includeCode"
                        checked={includeCode}
                        onCheckedChange={()=>setIncludeCode(prev=>!prev)}
                    />
                    <Label htmlFor="includeCode" className="text-sm">Include Code</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="includeQuesImg"
                        checked={includeQuestionImg}
                        onCheckedChange={()=>setIncludeQuestionImg(prev=>!prev)}
                    />
                    <Label htmlFor="includeQuesImg" className="text-sm">Include Question Img</Label>
                </div>
            </div>

            <div className="flex flex-1 flex-col">
                <ChatHistory messages={chatHistory}/>
            </div>

            {isPrompting && (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span className="text-sm text-muted-foreground">AI brainstorming...</span>
                </div>
            )}

            <div className="flex gap-2 items-center">
                <Textarea
                    onChange={(e)=>setPrompt(e.target.value)}
                    value={prompt}
                    placeholder="Ask a question"
                    className="resize-none"
                    disabled={isPrompting}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submitPrompt();
                        }
                    }}
                />
                <Button
                    onClick={submitPrompt}
                    disabled={isPrompting || prompt.trim().length === 0}
                    className=""
                >
                    <Send className="h-4 w-4"/>
                </Button>
            </div>
            
        </div>
    )

}

export default AiChat

const ChatHistory = ( { messages } : ChatHistoryProps) => {

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(()=> {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    return (
        <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 p-4">
                {messages.map((m, i) => {
                    const fromAI = i % 2 === 0
                    return (
                        <div
                            className={`flex ${fromAI ? "justify-start" : "justify-end"}`}
                            key={`aichat-${i}`}
                        >
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl
                                ${fromAI ? 
                                "bg-secondary text-secondary-foreground rounded-tl-none"
                                :
                                "bg-primary text-primary-foreground rounded-br-none"
                                }
                            `}>
                                {formatChatMessage(m)}
                            </div>
                        </div>
                    )})}
            </div>
        </ScrollArea>
    )
}

const formatChatMessage = (message : string) => {
    const parts = message.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language and code
        const [first, ...rest] = part.split('\n');
        const language = first.slice(3);
        const code = rest.slice(0, -1).join('\n');
        
        return (
          <div key={index} className="my-2 w-full">
            <div className="bg-muted p-2 rounded-t-md text-sm text-muted-foreground">
              {language || 'code'}
            </div>
            <pre className="bg-secondary p-4 rounded-b-md overflow-x-auto">
              <code className="text-sm">{code}</code>
            </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap">{part}</p>;
    });


}