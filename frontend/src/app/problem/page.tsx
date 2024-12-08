
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"

type Props = {}

const ProblemPage = (props: Props) => {
  return (
    <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
                Question
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