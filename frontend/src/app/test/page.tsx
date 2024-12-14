"use client"

import { supabase } from "@/lib/supabase";
import { useJudge0 } from "@/hooks/useJudge0";

export default function TestPage(){

    const {
        isSubmitting, error, codeOutput, codeError, codeMemoryUsed, codeTimeUsed,
        submitCode, clearCodeSubmission
    } = useJudge0();
    

  
    return (
        <div>
            <button onClick={ ()=> {
                submitCode({
                    source_code: "print('hello world!!!')",
                    language_id: "71"
                })
            }}>
                Run Code
            </button>

            <button onClick={clearCodeSubmission} className="px-4 text-red-500"> 
                Clear Submission
            </button>

            {isSubmitting && <p className="text-white">Submitting Code...</p>}
            {codeOutput && <p className="text-white">Code Output: {codeOutput}</p>}
            {codeMemoryUsed && <p className="text-white">Code Mem Used: {codeMemoryUsed}</p>}
            {codeTimeUsed && <p className="text-white">Code Time Used: {codeTimeUsed}</p>}

        </div>
    )

}