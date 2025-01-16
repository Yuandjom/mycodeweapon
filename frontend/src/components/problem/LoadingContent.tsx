
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton"

const LoadingContent = () => {
    return (
      <div className="h-full bg-slate-400 dark:bg-black border-t-8 border-slate-400 dark:border-black">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={40} className="mr-1 bg-slate-400 dark:bg-black">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50} className="mb-1 bg-background rounded-lg p-4">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>
              <ResizablePanel defaultSize={50} className="mt-1 bg-background rounded-lg p-4">
                <Skeleton className="h-32 w-full" />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>
          
          <ResizablePanel defaultSize={60} className="ml-1 bg-slate-400 dark:bg-black">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={75} className="mb-1 bg-background rounded-lg p-4">
                <Skeleton className="h-64 w-full" />
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-slate-400 dark:bg-black"/>
              <ResizablePanel defaultSize={25} className="mt-1 bg-background rounded-lg p-4">
                <Skeleton className="h-24 w-full" />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
}

export default LoadingContent