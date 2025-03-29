"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, BookOpen, Code, Lightbulb, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProblemState } from "@/types/problem";

interface TestCase {
  input: string;
  output: string;
}

interface ExtractedQuestion {
  title: string;
  description: string;
  examples: TestCase[];
  hints: string[];
}

export default function QuestionEditor({
  problemStates,
  onQuestionExtracted,
}: {
  onQuestionExtracted?: (data: ExtractedQuestion) => void;
  problemStates: ProblemState;
}) {
  const { toast } = useToast();

  const [url, setUrl] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractedQuestion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractQuestion = async () => {
    if (!url.trim() || !url.includes("leetcode.com/problems/")) {
      toast({ title: "Please enter a valid LeetCode problem URL" });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch(
        `http://localhost:8000/leetcode/scrape?url=${encodeURIComponent(url)}`
      );
  
      const data = await response.json();
  
      const mapped: ExtractedQuestion = {
        title: data.title,
        description: data.description,
        examples: data.examples,
        hints: data.hints,
      };
  
      setExtractedData(mapped);
      if (onQuestionExtracted) {
        onQuestionExtracted(mapped);
      }
  
      toast({ title: "Question extracted successfully!" });
    } catch (err) {
      toast({ title: "Failed to extract question" });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {!extractedData && (
        <>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground text-center">
              Enter a LeetCode problem URL to extract the question details.
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <Input
              placeholder="https://leetcode.com/problems/example-problem/"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={extractQuestion} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Extract
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {extractedData ? (
        <ScrollArea className="flex-1 px-1 -mx-1">
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold">{extractedData.title}</h1>
              <p className="text-sm text-muted-foreground">LeetCode Problem</p>
            </div>

            <Separator />

            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Description
              </h3>
              <div className="text-sm rounded-md p-1">
                <div
                  dangerouslySetInnerHTML={{
                    __html: extractedData.description,
                  }}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-base font-semibold mb-3 flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Examples
              </h3>
              <div className="space-y-4">
                {extractedData.examples.map((example, idx) => (
                  <div
                    key={idx}
                    className="rounded-md border p-3 bg-secondary/30"
                  >
                    <p className="font-medium text-sm mb-2">
                      Example {idx + 1}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Input:
                        </p>
                        <pre className="bg-background p-2 rounded-md text-sm mt-1 overflow-x-auto border">
                          {example.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Output:
                        </p>
                        <pre className="bg-background p-2 rounded-md text-sm mt-1 overflow-x-auto border">
                          {example.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {extractedData.hints && extractedData.hints.length > 0 && (
              <>
                <Separator />

                <div>
                  <h3 className="text-base font-semibold mb-2 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Hints
                  </h3>

                  <div className="mb-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setExtractedData((prev) =>
                          prev
                            ? {
                                ...prev,
                                hints: prev.hints.length > 0 ? prev.hints : [],
                                _showHints: !("_showHints" in prev)
                                  ? true
                                  : !(prev as any)._showHints,
                              }
                            : prev
                        )
                      }
                    >
                      {!(extractedData as any)._showHints ? "Show Hints" : "Hide Hints"}
                    </Button>
                  </div>

                  {(extractedData as any)._showHints && (
                    <ul className="space-y-2 list-disc list-inside text-sm pl-1">
                      {extractedData.hints.map((hint, idx) => (
                        <li key={idx} className="text-sm">
                          {hint}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}


            <div className="pb-4 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExtractedData(null)}
              >
                Reset
              </Button>
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">
            Enter a LeetCode URL and click "Extract" to view problem details
          </p>
        </div>
      )}
    </div>
  );
}
