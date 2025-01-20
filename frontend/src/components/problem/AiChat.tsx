"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useGemini } from "@/hooks/useGemini"
import { Loader2, Send } from "lucide-react"
import { useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"
import ReactMarkdown from "react-markdown"

interface ChatHistoryProps {
    messages: string[]
}

interface AiChatProps {
    questionImage: File | null
    code: string
    language: string
}

const AiChat = ({questionImage, code, language} : AiChatProps) => {
    const { 
        chatHistory, 
        prompt, 
        setPrompt, 
        isPrompting,
        includeCode, 
        setIncludeCode, 
        includeQuestionImg, 
        setIncludeQuestionImg, 
        submitPrompt 
    } = useGemini({ questionImage, code, language })

    return (
        <div className="flex flex-col h-full">
            {/* Prompt context flags */}
            <div className="flex gap-4 items-center p-4 border-b">
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

            <div className="flex-1 min-h-0">
                <ChatHistory messages={chatHistory}/>
            </div>

            <div className="p-4 border-t">
                {isPrompting && (
                    <div className="flex items-center gap-2 mb-2">
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
                    >
                        <Send className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Function to clean message text
    const cleanMessage = (text: string) => {
        return text
            // Replace literal \n with actual newlines
            .replace(/\\n/g, '\n')
            // Remove any extra spaces around newlines
            .trim();
    };

    return (
        <ScrollArea className="h-full pr-4">
            <div className="space-y-4 p-4">
                {messages.map((m, i) => {
                    const fromAI = i % 2 === 0;
                    return (
                        <div
                            className={`flex ${fromAI ? "justify-start" : "justify-end"}`}
                            key={`aichat-${i}`}
                        >
                            <div 
                                className={`max-w-[75%] px-4 py-2 rounded-2xl
                                    ${fromAI ? 
                                        "bg-blue-200 text-foreground rounded-tl-none" 
                                        : 
                                        "bg-green-200 text-primary-foreground rounded-br-none"
                                    }
                                `}
                            >
                                <ReactMarkdown
                                    className="prose max-w-none
                                        [&>*]:text-current
                                        prose-p:my-1 prose-p:first:mt-0 prose-p:last:mb-0
                                        prose-pre:my-2 
                                        prose-code:text-current
                                        prose-li:my-0"
                                    components={{
                                        pre: ({ children }) => (
                                            <div className="not-prose my-2 w-full">
                                                <pre className="bg-primary/20 p-4 rounded-md overflow-x-auto">
                                                    {children}
                                                </pre>
                                            </div>
                                        ),
                                        code: ({ inline, children } : any) => 
                                            inline ? (
                                                <code className="bg-primary px-1.5 py-0.5 rounded-md">
                                                    {children}
                                                </code>
                                            ) : (
                                                <code>{children}</code>
                                            )
                                    }}
                                >
                                    {cleanMessage(m)}
                                </ReactMarkdown>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>
        </ScrollArea>
    );
};

export default AiChat