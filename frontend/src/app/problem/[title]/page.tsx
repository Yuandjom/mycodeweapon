"use client"

import CodeEditor from "@/components/problem/CodeEditor"
import CodeOutput from "@/components/problem/CodeOutput"
import QuestionEditor from "@/components/problem/QuestionEditor"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { useAuth } from "@/providers/auth-provider"
import { useProblem } from "@/hooks/useProblem"
import { useJudge0 } from "@/hooks/useJudge0"
import { use } from 'react'


const ProblemPage = ({ params }: {
  params: Promise<{ title: string }>
}) => {

  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  // problem dependencies
  const { title } = use(params)
  const { 
    problemStates,
		setTitle,
		setQuestionImage,
		setCode,
		setLanguageId,
		saveProblem,
		resetProblem,
		isLoading,
		isSaving,
		error
   } = useProblem(title, user);

  // judge0 dependencies
  const { 
    languages, 
    submitCode, 
    isSubmitting, 
    codeOutput,
    codeErrorId,
    codeErrorDesc,
    codeMemoryUsed,
    codeTimeUsed 
  } = useJudge0();

  return (
    <div className="h-full bg-slate-400 dark:bg-black border-t-8 border-slate-400 dark:border-black">
        <ResizablePanelGroup 
          direction="horizontal"
        >
            <ResizablePanel defaultSize={40} className="mr-1 bg-slate-400 dark:bg-black">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50} className="mb-1 bg-background rounded-lg p-4">
                        <QuestionEditor
                          title={problemStates.title}
                          setTitle={setTitle}
                          image={problemStates.questionImage}
                          setImage={setQuestionImage}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>
                    <ResizablePanel defaultSize={50} className="mt-1 bg-background rounded-lg p-4">
                      <p>TODO AI chatbot integration</p>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>

            <ResizablePanel defaultSize={60} className="ml-1 bg-slate-400 dark:bg-black">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={75} className="mb-1 bg-background rounded-lg p-4">
                      <CodeEditor 
                        languages={languages}
                        languageId={problemStates.languageId}
                        onLanguageIdChange={setLanguageId}
                        code={problemStates.code}
                        onCodeChange={setCode}
                        onSubmitCode={submitCode}
                        isSubmitting={isSubmitting}
                        onSaveProblem={saveProblem}
                        isSaving={isSaving}
                      />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>
                    <ResizablePanel defaultSize={25} className="mt-1 bg-background rounded-lg p-4">
                      <CodeOutput
                        isSubmitting={isSubmitting}
                        codeOutput={codeOutput}
                        codeErrorId={codeErrorId}
                        codeErrorDesc={codeErrorDesc}
                        codeMemoryUsed={codeMemoryUsed}
                        codeTimeUsed={codeTimeUsed}
                      />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProblemPage