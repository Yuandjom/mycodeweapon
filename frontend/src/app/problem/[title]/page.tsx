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


  // code dependencies
  const { getAvailableLanguages } = useJudge0();
  const [languages, setLanguages] = useState<AvailLanguage[]>([]);
  const [code, setCode] = useState<string>("// your code here");

  

  useEffect(()=> {

    const afterRender = async () => {

      const availLanguages = await getAvailableLanguages();
      setLanguages(availLanguages);
    }

    afterRender();

  }, [])

  return (
    <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel>
                        Question: {problem?.title}
                        Description: {problem?.question}
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel>Test Cases</ResizablePanel>
                </ResizablePanelGroup>
                
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel>
                      <CodeEditor languages={languages}/>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel>
                      Code Output
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProblemPage