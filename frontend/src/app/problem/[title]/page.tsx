"use client"

import CodeEditor from "@/components/problem/CodeEditor"
import CodeOutput from "@/components/problem/CodeOutput"
import UploadQuestion from "@/components/utils/workspace"
import QuestionEditor from "@/components/problem/QuestionEditor"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"

import { useProblem } from "@/hooks/useProblem"
import { AvailLanguage } from "@/types/judge0"
import { useJudge0 } from "@/hooks/useJudge0"
import { use, useState, useEffect } from 'react'


const ProblemPage = ({ params }: {
  params: Promise<{ title: string }>
}) => {

  // problem dependencies
  const { title } = use(params)
  const { problem, setProblem, fetchError, isLoading } = useProblem(title);

  // judge0 dependencies
  // code dependencies
  const { 
    getAvailableLanguages, 
    submitCode, 
    isSubmitting, 
    codeOutput,
    codeErrorId,
    codeErrorDesc,
    codeMemoryUsed,
    codeTimeUsed 
  } = useJudge0();

  // code dependencies
  const [languages, setLanguages] = useState<AvailLanguage[]>([]);
  const [code, setCode] = useState<string>("# your code here");
  const [codeLanguageId, setCodeLanguageId] = useState<string>("71") // by default python which is id: 71
  
  const handleCodeChange = (value: string | undefined) => {
    if (value) setCode(value);
  }

  const handleCodeLanguageIdChange = (langId: string) => {
    setCodeLanguageId(langId);
  }

  const handleCodeSubmit = async () => {
    await submitCode({
      source_code: code,
      language_id: codeLanguageId
    })
  }


  useEffect(()=> {

    const afterRender = async () => {

      const availLanguages = await getAvailableLanguages();
      setLanguages(availLanguages);
    }

    afterRender();

  }, [])

  return (
    <div className="h-full bg-slate-400 dark:bg-black">
        <ResizablePanelGroup 
          direction="horizontal"
        >
            <ResizablePanel defaultSize={40} className="mr-1 bg-slate-400 dark:bg-black">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50} className="mb-1 bg-background rounded-lg p-4">
                        <QuestionEditor problem={problem} setProblem={setProblem}/>
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
                        languageId={codeLanguageId}
                        onLanguageIdChange={handleCodeLanguageIdChange}
                        code={code}
                        onCodeChange={handleCodeChange}
                        onSubmitCode={handleCodeSubmit}
                        isSubmitting={isSubmitting}
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