"use client"

import { useState, useEffect } from "react"
import { CodeSubmissionREQ, CodeSubmissionRES, AvailLanguage } from "@/types/judge0";
import { DEFAULT_MEMORY_LIMIT, DEFAULT_TIME_LIMIT, judge0ToMonacoMap } from "@/constants/judge0";
import { useAuth } from "@/providers/auth-provider";
import { submitCode_SA } from "@/actions/judge0";

export type submitCodeParams = {
    source_code: string;
    language_id: string;
}


export const useJudge0 = () => {

    const { user } = useAuth()

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [judge0Error, setJudge0Error] = useState<string | null>(null);

    // judge0 useful return values
    const [languages, setLanguages] = useState<AvailLanguage[]>([]);
    const [codeOutput, setCodeOutput] = useState<string | null>(null);
    const [codeErrorId, setCodeErrorId] = useState<number>(-1);
    const [codeErrorDesc, setCodeErrorDesc] = useState<string | null>(null);
    const [codeMemoryUsed, setCodeMemoryUsed] = useState<number | null>(null);
    const [codeTimeUsed, setCodeTimeUsed] = useState<string | null>(null);

    const submitCode = async ({ source_code, language_id }: submitCodeParams) => {

        setIsSubmitting(true);
        setJudge0Error(null);
        setCodeOutput(null);
        setCodeErrorId(-1);
        setCodeErrorDesc(null);
        setCodeMemoryUsed(null);
        setCodeTimeUsed(null);

        const submissionBody: CodeSubmissionREQ = {
            source_code,
            language_id,
            memory_limit: DEFAULT_MEMORY_LIMIT,
            time_limit: DEFAULT_TIME_LIMIT
        }

        try {

            if (!user) {
                throw new Error("You are not signed in")
            }

            const response = await submitCode_SA(submissionBody, user.id)

            if (response.error) {
                throw new Error(response.message);
            }

            const data = response.data as CodeSubmissionRES
            console.log("[submitCode] After SA")
            setCodeOutput(data.stdout);
            setCodeErrorId(data.status.id);
            setCodeErrorDesc(data.stderr);
            setCodeMemoryUsed(data.memory);
            setCodeTimeUsed(data.time);


        } catch (err) {
            setJudge0Error(err instanceof Error ? err.message : "Unknown error occured")
        } finally {
            setIsSubmitting(false);
        }

    }

    const clearCodeSubmission = () => {
        setIsSubmitting(false);
        setJudge0Error(null);
        setCodeOutput(null);
        setCodeErrorId(-1);
        setCodeErrorDesc(null);
        setCodeMemoryUsed(null);
        setCodeTimeUsed(null);
    }

    useEffect(() => {
        const getAvailableLanguages = async (): Promise<AvailLanguage[]> => {

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

                const filteredLangauges = data.filter((d: any) => d.id.toString() in judge0ToMonacoMap).sort((a: any, b: any) => a.name.localeCompare(b.name));;

                setLanguages(filteredLangauges);


            } catch (err) {
                console.log("Error in fetching languages: ", err);
            }

            return [];

        }

        getAvailableLanguages();

    }, [])

    return {
        isSubmitting, judge0Error, languages, codeOutput, codeErrorId, codeErrorDesc, codeMemoryUsed, codeTimeUsed,
        submitCode, // caller function
        clearCodeSubmission,
    }

}