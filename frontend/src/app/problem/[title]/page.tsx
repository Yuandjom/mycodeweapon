"use client"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"

import { useProblem } from "@/hooks/useProblem"
import { use } from 'react'


const ProblemPage = ({ params }: {
  params: Promise<{ title: string }>
}) => {
  const { title } = use(params)

const { problem, fetchError, isLoading } = useProblem(title);

  return (
    <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                Question: {problem?.title}

                Description: {problem?.question}
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel>
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel>Code Editor</ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel>Test Cases</ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProblemPage