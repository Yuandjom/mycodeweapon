"use client";

import CodeEditor from "@/components/problem/CodeEditor";
import CodeOutput from "@/components/problem/CodeOutput";
import QuestionEditor from "@/components/problem/QuestionEditor";
import AiChat from "@/components/problem/AiChat";
import LoadingContent from "@/components/problem/LoadingContent";
import CollapsiblePanel from "@/components/utils/CollapsiblePanel";
import LightDarkToggle from "@/components/utils/LightDarkToggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuth } from "@/providers/auth-provider";
import { useProblem } from "@/hooks/useProblem";
import { useJudge0 } from "@/hooks/useJudge0";
import { Suspense } from "react";
import Link from "next/link";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Code, Clock } from "lucide-react";
import Timer from "@/components/utils/Timer";
import { cn } from "@/lib/utils";
import { judge0ToMonacoMap } from "@/constants/judge0";

const ProblemPage = ({ title }: { title: string }) => {
  const { user, authLoading } = useAuth();

  // problem dependencies
  const {
    problemStates,
    setTitle,
    setDescription,
    setHints,
    setStatus,
    setCode,
    setLanguageId,
    resetProblem,
    isLoading,
    error,
  } = useProblem(title, user);

  // judge0 dependencies
  const {
    judge0Error,
    languages,
    submitCode,
    isSubmitting,
    codeOutput,
    codeErrorId,
    codeErrorDesc,
    codeMemoryUsed,
    codeTimeUsed,
  } = useJudge0();

  // TODO: different error types - right now they are all clustered together in this one variable
  if (error) {
    return (
      <div className="h-full w-full flex_col_center gap-4">
        <p>No problem titled: {title} found</p>
        <div>
          <Link
            className="underline text-teal-600 hover:text-teal-700 font-medium"
            href="/problem/new"
            onClick={resetProblem}
          >
            Create new problem
          </Link>
        </div>
      </div>
    );
  }

  const onQuestionExtracted = (title: string, description: string) => {
    setTitle(title);
    setDescription(description);
  };

  const handleCodeSubmit = async () => {
    await submitCode({
      source_code: problemStates.code,
      language_id: problemStates.languageId,
    });
  };

  return (
    <Suspense fallback={<LoadingContent />}>
      {authLoading || isLoading ? (
        <LoadingContent />
      ) : (
        <div className="h-full w-full flex flex-col bg-teal-500/70 dark:bg-teal-500/90 border border-teal-500/30 dark:border-teal-700/30 rounded-lg overflow-hidden shadow-lg shadow-teal-500/10 dark:shadow-teal-700/10 backdrop-blur-sm">
          {/* Global Header/Navbar - Moved from CodeEditor */}
          <div className="w-full bg-background/95 border-b border-teal-500/30 dark:border-teal-700/30 flex items-center justify-between px-4 py-3 shadow-md shadow-teal-500/10 dark:shadow-teal-700/10">
            {/* Left - Title */}
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent capitalize">
                {problemStates.title}
              </h1>
            </div>

            {/* Middle - Timer */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-teal-500/30 dark:border-teal-700/30 backdrop-blur-sm bg-secondary/70">
                <Clock className="h-3.5 w-3.5 text-teal-500/80 dark:text-teal-400/80" />
                <Timer className="text-foreground font-mono text-xs" />
              </div>
            </div>

            {/* Right - Language Selector and Run Button */}
            <div className="flex-1 flex items-center justify-end gap-4">
              <div className="flex items-center">
                <Combobox
                  keyword={"language"}
                  selections={languages.map((lang) => {
                    return { value: lang.id, label: lang.name };
                  })}
                  defaultValue={problemStates.languageId}
                  onSelectChange={setLanguageId}
                  className="border-teal-500/30 dark:border-teal-700/30 focus-within:ring-teal-500 dark:focus-within:ring-teal-400 bg-secondary/70 text-foreground hover:bg-accent/50"
                />
              </div>

              <Button
                onClick={handleCodeSubmit}
                className={cn(
                  "h-9 transition-all border shadow-md rounded px-4 py-1 group relative",
                  isSubmitting
                    ? "bg-muted text-muted-foreground border-teal-500/20 dark:border-teal-700/20"
                    : "bg-gradient-to-r from-teal-500/90 to-green-500/90 hover:from-teal-600/90 hover:to-green-600/90 text-white border-transparent shadow-teal-500/20 dark:shadow-teal-700/20"
                )}
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-1.5 relative z-10">
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 transition-transform" />
                  )}
                  <span className="font-medium text-sm">
                    {isSubmitting ? "Running..." : "Run"}
                  </span>
                </div>
              </Button>
              <LightDarkToggle />
            </div>
          </div>

          {/* Mobile warning */}
          <div className="flex_center md:hidden bg-gradient-to-r from-teal-700 to-green-700 w-full rounded-b-lg shadow-lg">
            <p className="text-white font-bold py-2">
              Use larger screens for code execution features!
            </p>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-hidden p-1.5 bg-slate-800/80 dark:bg-black/80">
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full rounded-lg overflow-hidden border border-teal-500/20 dark:border-teal-700/20"
            >
              <ResizablePanel
                defaultSize={40}
                minSize={27}
                className="mr-0.5 bg-slate-800/70 dark:bg-black/90"
              >
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    defaultSize={50}
                    minSize={20}
                    className="mb-0.5 bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-teal-700/20 shadow-md shadow-teal-500/10"
                  >
                    <QuestionEditor
                      problemStates={problemStates}
                      onQuestionExtracted={onQuestionExtracted}
                    />
                  </ResizablePanel>
                  <ResizableHandle
                    withHandle
                    className="bg-slate-800/70 dark:bg-black/90 after:bg-teal-700 after:shadow-md after:shadow-teal-500/20"
                  />
                  <ResizablePanel
                    defaultSize={50}
                    minSize={20}
                    className="mb-0.5 bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-green-500/20 shadow-md shadow-green-500/10"
                  >
                    <AiChat
                      userId={user?.id || ""}
                      problemStates={problemStates}
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="bg-slate-800/70 dark:bg-black/90 hidden md:flex after:bg-teal-700 after:shadow-md after:shadow-teal-500/20"
              />

              <ResizablePanel
                defaultSize={60}
                className="ml-0.5 bg-slate-800/70 dark:bg-black/90 hidden md:flex"
              >
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    defaultSize={75}
                    className="mb-0.5 bg-background/95 backdrop-blur-sm rounded-lg border border-teal-500/20 shadow-md shadow-teal-500/10"
                  >
                    <CodeEditor
                      languages={languages}
                      languageId={problemStates.languageId}
                      onLanguageIdChange={setLanguageId}
                      code={problemStates.code}
                      onCodeChange={setCode}
                      onSubmitCode={submitCode}
                      isSubmitting={isSubmitting}
                      showHeader={false} // New prop to hide the header in CodeEditor
                    />
                  </ResizablePanel>
                  <ResizableHandle
                    withHandle
                    className="bg-slate-800/70 dark:bg-black/90 after:bg-green-700 after:shadow-md after:shadow-green-500/20"
                  />
                  <CollapsiblePanel
                    defaultSize={25}
                    className="mt-0.5 bg-background/95 backdrop-blur-sm rounded-lg p-4 border border-green-500/20 shadow-md shadow-green-500/10"
                    collapsedText="Code Output"
                    collapseThreshold={15}
                    collapsedSize={5}
                  >
                    <CodeOutput
                      judge0Error={judge0Error}
                      isSubmitting={isSubmitting}
                      codeOutput={codeOutput}
                      codeErrorId={codeErrorId}
                      codeErrorDesc={codeErrorDesc}
                      codeMemoryUsed={codeMemoryUsed}
                      codeTimeUsed={codeTimeUsed}
                    />
                  </CollapsiblePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default ProblemPage;
