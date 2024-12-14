"use client"

import { useState } from "react"
import { CodeSubmissionREQ, CodeSubmissionRES, AvailLanguage } from "@/types/judge0";
import { judge0_LanguageToLanguageIDMap, DEFAULT_MEMORY_LIMIT, DEFAULT_TIME_LIMIT } from "@/constants/judge0";

export type submitCodeParams = {
    source_code: string;
    language: string;
}


export const useJudge0 = () => {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // judge0 useful return values
    const [codeOutput, setCodeOutput] = useState<string | null>(null);
    const [codeError, setCodeError] = useState<string | null>(null);
    const [codeMemoryUsed, setCodeMemoryUsed] = useState<number | null>(null);
    const [codeTimeUsed, setCodeTimeUsed] = useState<string | null>(null);

    const submitCode = async ({source_code, language} : submitCodeParams ) => {

        setIsSubmitting(true);
        setError(null);
        setCodeOutput(null);
        setCodeError(null);
        setCodeMemoryUsed(null);
        setCodeTimeUsed(null);

        const language_id = judge0_LanguageToLanguageIDMap[language]

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
            setCodeError(data.stderr);
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
        setCodeError(null);
        setCodeMemoryUsed(null);
        setCodeTimeUsed(null);
    }

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
            
            return data;

        
        } catch(err) {
            console.log("Error in fetching languages: ", err);
        }

        return [];
        
    }

    return {
        isSubmitting, error, codeOutput, codeError, codeMemoryUsed, codeTimeUsed,
        submitCode, // caller function
        clearCodeSubmission,
        getAvailableLanguages
    }

}