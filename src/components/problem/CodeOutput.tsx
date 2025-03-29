import { ScrollArea } from "@/components/ui/scroll-area";
import { statusIdToDescMap } from "@/constants/judge0";
import { cn } from "@/lib/utils";
import { Terminal, AlertCircle, Clock10Icon, CpuIcon } from "lucide-react";

type Props = {
  judge0Error: string | null;
  isSubmitting: boolean;
  codeOutput: string | null;
  codeErrorId: number;
  codeErrorDesc: string | null;
  codeMemoryUsed: number | null;
  codeTimeUsed: string | null;
};

const CodeOutput = ({
  judge0Error,
  isSubmitting,
  codeOutput,
  codeErrorId,
  codeErrorDesc,
  codeMemoryUsed,
  codeTimeUsed,
}: Props) => {
  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-start items-center space-x-4 pt-1">
        <div className="flex justify-center items-center space-x-2">
          <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center">
            <Clock10Icon className="h-4 w-4 mr-1" />
            Time:
          </span>
          <span
            className={cn(
              "text-sm font-mono p-1.5 rounded-md border bg-teal-50/20 dark:bg-teal-900/10 backdrop-blur-sm",
              Number(codeTimeUsed) > 1
                ? "text-amber-600 dark:text-amber-400"
                : "text-green-600 dark:text-green-400"
            )}
          >
            {codeTimeUsed ? codeTimeUsed : "0.00"} s
          </span>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <span className="font-semibold text-green-600 dark:text-green-400 flex items-center">
            <CpuIcon className="h-4 w-4 mr-1" />
            Memory:
          </span>
          <span className="text-sm font-mono p-1.5 rounded-md border bg-green-50/20 dark:bg-green-900/10 backdrop-blur-sm text-green-600 dark:text-green-400">
            {codeMemoryUsed ? codeMemoryUsed : "0"} KB
          </span>
        </div>
      </div>

      {codeErrorId >= 5 && (
        <div className="space-y-2">
          <p className="font-semibold text-red-500 dark:text-red-400 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {statusIdToDescMap[codeErrorId]}
          </p>
          <ScrollArea className="w-full h-1/3 rounded-md border border-red-400/30 dark:border-red-500/30 p-3 text-red-500 dark:text-red-400 text-sm bg-red-50/20 dark:bg-red-900/10 backdrop-blur-sm">
            <pre className="font-mono text-xs">{codeErrorDesc}</pre>
          </ScrollArea>
        </div>
      )}

      {judge0Error && (
        <div className="space-y-2">
          <p className="font-semibold text-red-500 dark:text-red-400 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            System Error
          </p>
          <div className="w-full rounded-md border border-red-400/30 dark:border-red-500/30 p-3 text-red-500 dark:text-red-400 text-sm bg-red-50/20 dark:bg-red-900/10 backdrop-blur-sm">
            {judge0Error}
          </div>
        </div>
      )}

      {!judge0Error && !(codeErrorId >= 5) && (
        <div className="space-y-2">
          <p className="font-semibold text-teal-600 dark:text-teal-400 flex items-center">
            <Terminal className="h-4 w-4 mr-2" />
            Output
          </p>
          <ScrollArea className="w-full min-h-28 rounded-md border border-teal-500/20 p-3 bg-background/80 backdrop-blur-sm text-sm shadow-sm">
            <div className="relative">
              {isSubmitting ? (
                <div className="flex items-center justify-center h-24 text-muted-foreground">
                  <div className="animate-pulse">Processing code...</div>
                </div>
              ) : codeOutput ? (
                <pre className="font-mono">{codeOutput}</pre>
              ) : (
                <div className="flex items-center justify-center h-24 text-muted-foreground">
                  <div className="text-center space-y-2">
                    <p>Run your code to see output here</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CodeOutput;
