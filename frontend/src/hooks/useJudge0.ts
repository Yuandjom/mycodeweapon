"use client"

import { useState, useEffect } from "react"
import { CodeSubmissionREQ, CodeSubmissionRES, AvailLanguage } from "@/types/judge0";
import { DEFAULT_MEMORY_LIMIT, DEFAULT_TIME_LIMIT, judge0ToMonacoMap } from "@/constants/judge0";

export type submitCodeParams = {
    source_code: string;
    language_id: string;
}


export const useJudge0 = () => {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // judge0 useful return values
    const [languages, setLanguages] = useState<AvailLanguage[]>([]);
    const [codeOutput, setCodeOutput] = useState<string | null>(null);
    const [codeErrorId, setCodeErrorId] = useState<number>(-1);
    const [codeErrorDesc, setCodeErrorDesc] = useState<string | null>(null);
    const [codeMemoryUsed, setCodeMemoryUsed] = useState<number | null>(null);
    const [codeTimeUsed, setCodeTimeUsed] = useState<string | null>(null);

    const submitCode = async ({source_code, language_id} : submitCodeParams ) => {

        setIsSubmitting(true);
        setError(null);
        setCodeOutput(null);
        setCodeErrorId(-1);
        setCodeErrorDesc(null);
        setCodeMemoryUsed(null);
        setCodeTimeUsed(null);

        const submissionBody : CodeSubmissionREQ = {
            source_code,
            language_id,
            memory_limit: DEFAULT_MEMORY_LIMIT,
            time_limit: DEFAULT_TIME_LIMIT
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_JUDGE0_URL}/submissions?wait=true`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-token": "TODOAPITOKEN"
                    },
                    body: JSON.stringify(submissionBody)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error in request to Judge0, Status: ${response.status}`);
            }

            const data: CodeSubmissionRES = await response.json();

            setCodeOutput(data.stdout);
            setCodeErrorId(data.status.id);
            setCodeErrorDesc(data.stderr);
            setCodeMemoryUsed(data.memory);
            setCodeTimeUsed(data.time);


        } catch(err) {
            setError(err instanceof Error ? err.message : "Unknown error occured")
        } finally {
            setIsSubmitting(false);
        }

    }

    const clearCodeSubmission = () => {
        setIsSubmitting(false);
        setError(null);
        setCodeOutput(null);
        setCodeErrorId(-1);
        setCodeErrorDesc(null);
        setCodeMemoryUsed(null);
        setCodeTimeUsed(null);
    }

    useEffect(()=> {
        const getAvailableLanguages = async () : Promise<AvailLanguage[]> => {

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_JUDGE0_URL}/languages`,
                    {
                        method: "GET",
                        headers: {
                            "api-token": "TODOAPITOKEN",
                        }
                    }
                );
    
                if (!response.ok) {
                    throw new Error(`HTTP Error in request to Judge0, Status: ${response.status}`);
                }
    
                const data = await response.json();
                
                const filteredLangauges = data.filter((d : any) => d.id.toString() in judge0ToMonacoMap).sort((a: any, b : any) => a.name.localeCompare(b.name));;
    
                setLanguages(filteredLangauges);
    
            
            } catch(err) {
                console.log("Error in fetching languages: ", err);
            }
    
            return [];
            
        }

        getAvailableLanguages();

    }, [])

    return {
        isSubmitting, error, languages, codeOutput, codeErrorId, codeErrorDesc, codeMemoryUsed, codeTimeUsed,
        submitCode, // caller function
        clearCodeSubmission,
    }

}