"use client"

import CodeEditor from "@/components/ui/code-edit"
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
  const { problem, fetchError, isLoading } = useProblem(title);

  // judge0 dependencies
  // code dependencies
  const { 
    getAvailableLanguages, 
    submitCode, 
    isSubmitting, 
    codeOutput, 
    codeError,
    codeMemoryUsed,
    codeTimeUsed 
  } = useJudge0();

  // code dependencies
  const [languages, setLanguages] = useState<AvailLanguage[]>([]);
  const [code, setCode] = useState<string>("// your code here");
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
    <div className="h-screen bg-slate-400 dark:bg-black">
        <ResizablePanelGroup 
          direction="horizontal"
        >
            <ResizablePanel defaultSize={40} className="mr-1 bg-slate-400 dark:bg-black">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50} className="mb-1 bg-background rounded-lg">
                        Question: {problem?.title}
                        Description: {problem?.question}
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>
                    <ResizablePanel defaultSize={50} className="mt-1 bg-background rounded-lg">
                      AI Chatbot
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>

            <ResizablePanel defaultSize={60} className="ml-1 bg-slate-400 dark:bg-black">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={75} className="mb-1 bg-background rounded-lg">
                      <CodeEditor 
                        languages={languages}
                        languageId={codeLanguageId}
                        onLanguageIdChange={handleCodeLanguageIdChange}
                        code={code}
                        onCodeChange={handleCodeChange}
                        onSubmitCode={handleCodeSubmit}
                      />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>
                    <ResizablePanel defaultSize={25} className="mt-1 bg-background rounded-lg">
                      <p>Code Language Id: {codeLanguageId}</p>
                      <p>Code: {code}</p>
                      <p>Output: {codeOutput}</p>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProblemPage