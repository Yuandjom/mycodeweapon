"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, BookOpen, Code, Lightbulb, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProblemState } from "@/types/problem";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface ExtractedQuestion {
  title: string;
  description: string;
  examples: TestCase[];
  hints: string[];
  constraints?: string[];
  _showHints?: boolean;
}

interface Platform {
  id: string;
  name: string;
  urlPattern: string;
  placeholder: string;
  isAvailable: boolean;
}

export default function QuestionEditor({
  problemStates,
  onQuestionExtracted,
}: {
  onQuestionExtracted: (title: string, description: string) => void;
  problemStates: ProblemState;
}) {
  const { toast } = useToast();

  const platforms: Platform[] = [
    {
      id: "leetcode",
      name: "LeetCode",
      urlPattern: "leetcode.com/problems/",
      placeholder: "https://leetcode.com/problems/example-problem/",
      isAvailable: true,
    },
    {
      id: "codewars",
      name: "CodeWars",
      urlPattern: "codewars.com/kata/",
      placeholder: "https://www.codewars.com/kata/example-problem",
      isAvailable: false,
    },
    {
      id: "codemonkey",
      name: "CodeMonkey",
      urlPattern: "codemonkey.com/challenges/",
      placeholder: "https://www.codemonkey.com/challenges/example-problem",
      isAvailable: false,
    },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState<string>("leetcode");
  const [url, setUrl] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractedQuestion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

  const currentPlatform = platforms.find((p) => p.id === selectedPlatform);

  // URL validation effect
  useEffect(() => {
    if (url.trim() === "") {
      setIsValidUrl(true);
      return;
    }

    if (!currentPlatform) {
      setIsValidUrl(false);
      return;
    }

    setIsValidUrl(url.includes(currentPlatform.urlPattern));
  }, [url, currentPlatform]);

  const extractQuestion = async () => {
    if (!url.trim() || !url.includes(currentPlatform?.urlPattern || "")) {
      toast({
        title: "Invalid URL",
        description: `Please enter a valid ${currentPlatform?.name} problem URL`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(10); // Start with some initial progress

    // More natural progress simulation with variable speeds
    const simulateProgress = () => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Slower at beginning and end, faster in middle
          if (prev < 30) return prev + 2;
          if (prev < 60) return prev + 4;
          if (prev < 85) return prev + 2;
          if (prev >= 85) {
            clearInterval(interval);
            return 90; // Cap at 90% until actual completion
          }
          return prev;
        });
      }, 200);

      return interval;
    };

    const progressInterval = simulateProgress();

    try {
      // Only LeetCode is supported for now, but this structure makes it easy to add more platforms
      let endpoint = "";

      if (selectedPlatform === "leetcode") {
        endpoint = `/leetcode/scrape`;
      } else {
        throw new Error("Platform not supported yet");
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }${endpoint}?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      const mapped: ExtractedQuestion = {
        title: data.title,
        description: data.description,
        examples: data.examples,
        hints: data.hints,
        constraints: data.constraints,
      };

      setProgress(100);
      clearInterval(progressInterval);

      // Small delay to show the 100% progress state before hiding
      setTimeout(() => {
        setExtractedData(mapped);
        onQuestionExtracted(data.title, data.description);
        setIsLoading(false);
      }, 500);

      toast({
        title: "Success!",
        description: "Question extracted successfully",
        variant: "default",
      });
    } catch (err) {
      clearInterval(progressInterval);
      toast({
        title: "Extraction failed",
        description:
          "Could not extract the question. Please check the URL and try again.",
        variant: "destructive",
      });
      setProgress(0);
      setIsLoading(false);
    }
  };

  const toggleHints = () => {
    setExtractedData((prev) =>
      prev
        ? {
            ...prev,
            _showHints: !prev._showHints,
          }
        : prev
    );
  };

  const handleChangePlatform = (value: string) => {
    setSelectedPlatform(value);
    setUrl("");
    setIsValidUrl(true);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {!extractedData ? (
        <div className="space-y-4 mb-6">
          <div className="space-y-3">
            <div className="w-full">
              <Select
                value={selectedPlatform}
                onValueChange={handleChangePlatform}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full mb-3">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem
                      key={platform.id}
                      value={platform.id}
                      disabled={!platform.isAvailable}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{platform.name}</span>
                        {!platform.isAvailable && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-yellow-700 rounded-full"
                          >
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder={
                  currentPlatform?.placeholder || "Enter problem URL"
                }
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`flex-1 transition-all ${
                  !isValidUrl && url.trim() !== ""
                    ? "border-red-400 focus-visible:ring-red-400"
                    : ""
                }`}
                disabled={isLoading || !currentPlatform?.isAvailable}
              />
              <Button
                onClick={extractQuestion}
                disabled={
                  isLoading ||
                  (url.trim() !== "" && !isValidUrl) ||
                  !currentPlatform?.isAvailable
                }
                className="transition-all"
              >
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

            {!isValidUrl && url.trim() !== "" && (
              <p className="text-xs text-red-400 pl-1">
                Please enter a valid {currentPlatform?.name} URL (e.g.,
                {currentPlatform?.placeholder})
              </p>
            )}

            {isLoading && (
              <div className="w-full space-y-2 mt-2 transition-all">
                <Progress value={progress} className="h-2 w-full" />
                <p className="text-xs text-center text-muted-foreground">
                  {progress < 40
                    ? "Fetching problem..."
                    : progress < 75
                    ? "Parsing content..."
                    : progress < 95
                    ? "Preparing data..."
                    : "Almost done..."}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {extractedData ? (
        <ScrollArea className="flex-1 px-1 -mx-1">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold">{extractedData.title}</h1>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setExtractedData(null)}
                  className="mt-1 transition-colors bg-transparent hover:bg-destructive"
                >
                  Reset
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-base font-semibold mb-2 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Description
              </h3>
              <div className="text-sm rounded-md p-1">
                <div className="space-y-1">
                  {extractedData.description.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
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
                      {example.explanation && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Explanation:
                          </p>
                          <pre className="bg-background p-2 rounded-md text-sm mt-1 overflow-x-auto border">
                            {example.explanation}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {extractedData.constraints &&
              extractedData.constraints.length > 0 && (
                <>
                  <Separator />

                  <div>
                    <h3 className="text-base font-semibold mb-2 flex items-center">
                      <Code className="mr-2 h-4 w-4" />
                      Constraints
                    </h3>
                    <ul className="list-disc list-inside text-sm pl-1">
                      {extractedData.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

            {extractedData.hints && extractedData.hints.length > 0 && (
              <>
                <Separator />

                <div>
                  <h3 className="text-base font-semibold mb-2 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Hints
                  </h3>

                  <div className="mb-2">
                    <Button size="sm" variant="outline" onClick={toggleHints}>
                      {!extractedData._showHints ? "Show Hints" : "Hide Hints"}
                    </Button>
                  </div>

                  {extractedData._showHints && (
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
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">
            Select a platform, enter a problem URL, and click "Extract" to view
            problem details
          </p>
        </div>
      )}
    </div>
  );
}
