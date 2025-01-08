import { ScrollArea } from "@/components/ui/scroll-area"
import { statusIdToDescMap } from "@/constants/judge0";

type Props = {
    isSubmitting: boolean,
    codeOutput: string | null,
    codeErrorId: number,
    codeErrorDesc: string | null,
    codeMemoryUsed: number | null,
    codeTimeUsed: string | null,
}

const CodeOutput = ({isSubmitting, codeOutput, codeErrorId, codeErrorDesc, codeMemoryUsed, codeTimeUsed}: Props) => {
  return (
    <div className="w-full h-full space-y-4">
        {codeErrorId >= 5 && <div className="text-red-500">
            <p className="font-semibold">{statusIdToDescMap[codeErrorId]}</p>
            <ScrollArea className="w-full h-1/3 rounded-md border p-2 text-red-400 text-sm">
                {codeErrorDesc}
            </ScrollArea>
        </div>}

        <div className="flex justify-start items-center space-x-4">
            <div className="flex justify-center items-baseline space-x-2">
                <span className="font-semibold">Time:</span>
                <span className="text-sm font-normal bg-popover p-1 rounded-md">{codeTimeUsed ? codeTimeUsed : 0} s</span>
            </div>
            <div className="flex justify-center items-baseline space-x-2">
                <span className="font-semibold">Memory:</span>
                <span className="text-sm font-normal bg-popover p-1 rounded-md">{codeMemoryUsed ? codeMemoryUsed : 0} KB</span>
            </div>
        </div>

        <div>
            <p className="font-semibold">Stdout</p>
            <ScrollArea className="w-full min-h-28 rounded-md border p-2 bg-popover text-sm">
                {codeOutput}
            </ScrollArea>
        </div>


    </div>
  )
}

export default CodeOutput