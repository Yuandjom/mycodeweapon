"use client";

import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiChatRole, AiOption } from "@/types/ai";
import { displayAiOption } from "@/constants/aiSettings";
import ReactMarkdown from "react-markdown";
import { Code, Copy, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  atomDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

interface ChatMessagesProps {
  aiOption: AiOption;
  messages: ChatCompletionMessageParam[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ aiOption, messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to clean message text and handle different content types
  const processMessageContent = (message: ChatCompletionMessageParam) => {
    // Handle different types of content (string or multimodal array)
    if (typeof message.content === "string") {
      return message.content.replace(/\\n/g, "\n").trim();
    }

    // For future multimodal output support
    return message.content;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Chat message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <ScrollArea className="h-full w-full pr-4 ">
      <div className="space-y-5 p-4 w-full">
        {messages.map((message, index) => {
          const isAi = message.role === AiChatRole.Ai;
          const content = processMessageContent(message);

          return (
            <motion.div
              key={`aichat-${index}`}
              className={cn(
                "flex w-full",
                isAi ? "justify-start" : "justify-end"
              )}
              initial="hidden"
              animate="visible"
              variants={messageVariants}
            >
              <div
                className={cn(
                  "max-w-[85%] px-5 py-4 rounded-lg break-words backdrop-blur-sm relative overflow-hidden",
                  isAi
                    ? "bg-gradient-to-br from-purple-500/20 to-indigo-700/20 text-foreground rounded-tl-none border border-purple-500/30 dark:border-purple-600/40 shadow-lg shadow-purple-500/10"
                    : "bg-gradient-to-br from-teal-400/20 to-green-600/20 text-foreground rounded-br-none border border-teal-400/30 dark:border-teal-500/40 shadow-lg shadow-teal-500/10"
                )}
              >
                {/* Decorative elements for high-tech look */}
                <div
                  className={cn(
                    "absolute top-0 left-0 w-full h-1",
                    isAi
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                      : "bg-gradient-to-r from-teal-400 to-green-600"
                  )}
                />

                <div className="flex items-center gap-2 mb-2 text-xs font-medium">
                  {isAi ? (
                    <span className="text-purple-500 dark:text-purple-300 flex items-center">
                      <Zap size={14} className="mr-1 animate-pulse" />
                      {displayAiOption(aiOption)}
                    </span>
                  ) : (
                    <span className="text-teal-500 dark:text-teal-300">
                      You
                    </span>
                  )}
                </div>

                {/* Message content */}
                <ReactMarkdown
                  className={cn(
                    "prose prose-sm max-w-none break-words dark:prose-invert",
                    "prose-headings:font-semibold prose-headings:text-foreground",
                    "prose-p:my-1.5 prose-p:text-current",
                    isAi
                      ? "prose-a:text-purple-500 dark:prose-a:text-purple-300"
                      : "prose-a:text-teal-500 dark:prose-a:text-teal-300",
                    "prose-code:text-foreground",
                    "prose-ol:my-2 prose-ul:my-2",
                    "prose-li:my-0.5",
                    "prose-blockquote:border-l-2 prose-blockquote:border-muted-foreground prose-blockquote:pl-4 prose-blockquote:italic"
                  )}
                  components={{
                    // Code block with syntax highlighting
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "";

                      // Clean the code content - remove backticks when displayed
                      const codeContent = String(children).replace(/\n$/, "");

                      // Handle special case for pseudocode which might not have a language tag
                      const isPseudocode =
                        !inline &&
                        (language === "pseudocode" ||
                          (!language &&
                            codeContent.includes("function") &&
                            codeContent.includes("return")));

                      return !inline && (match || isPseudocode) ? (
                        <div className="rounded-md overflow-hidden my-3 border border-purple-500/30 dark:border-purple-400/30">
                          {/* Language label */}
                          <div className="flex justify-between items-center gap-1 px-3 py-2 text-xs font-medium bg-gray-900 dark:bg-gray-900 border-b border-purple-500/30">
                            <div className="flex items-center gap-2">
                              <Code size={16} className="text-purple-400" />
                              <span className="text-teal-300">
                                {language || "pseudocode"}
                              </span>
                            </div>
                            <div className="flex justify-end items-center">
                              <Button
                                variant="ghost"
                                onClick={() => handleCopyCode(codeContent)}
                                className="m-0 p-1 h-6 w-6 hover:bg-purple-500/20 dark:hover:bg-purple-500/30 rounded-full transition-colors"
                                size="sm"
                              >
                                {copied ? (
                                  <Check size={14} className="text-green-400" />
                                ) : (
                                  <Copy size={14} className="text-purple-300" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <SyntaxHighlighter
                            language={language}
                            style={atomDark}
                            customStyle={{
                              margin: 0,
                              borderRadius: 0,
                              fontSize: "0.875rem",
                              padding: "1rem",
                              lineHeight: 1.5,
                              maxWidth: "100%",
                              overflowX: "auto",
                              backgroundColor: "#161b22", // Deeper dark for code blocks
                            }}
                            wrapLines={true}
                            wrapLongLines={true}
                            {...props}
                          >
                            {codeContent}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded-md font-mono text-sm inline-block",
                            isAi
                              ? "bg-purple-500/10 border border-purple-500/20"
                              : "bg-teal-500/10 border border-teal-500/20"
                          )}
                          {...props}
                        >
                          {codeContent.replace(/`/g, "")}
                        </span>
                      );
                    },
                    // Custom pre renderer (needed for compatibility with ReactMarkdown)
                    pre({ children }) {
                      return <>{children}</>;
                    },
                    // Style headings
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold my-3 pb-1 border-b border-purple-500/30">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-bold my-2 pb-0.5 text-teal-500 dark:text-teal-300">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-bold my-2 text-purple-500 dark:text-purple-300">
                        {children}
                      </h3>
                    ),
                    // Style blockquotes for hints/tips
                    blockquote: ({ children }) => (
                      <blockquote
                        className={cn(
                          "border-l-4 pl-4 py-1 my-2 rounded-r-md",
                          isAi
                            ? "border-purple-500 bg-purple-500/10 dark:bg-purple-900/20"
                            : "border-teal-500 bg-teal-500/10 dark:bg-teal-900/20"
                        )}
                      >
                        {children}
                      </blockquote>
                    ),
                    // Style lists
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 my-2 space-y-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 my-2 space-y-1">
                        {children}
                      </ol>
                    ),
                  }}
                >
                  {typeof content === "string" ? content : ""}
                </ReactMarkdown>
              </div>
            </motion.div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
