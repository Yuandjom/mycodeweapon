"use server"

import { CodeSubmissionREQ, CodeSubmissionRES } from "@/types/judge0";

export const submitCode_SA = async (submissionBody: CodeSubmissionREQ, userId: string) => {

    try {
        const response = await fetch(
            `${process.env.JUDGE0_API_GATEWAY}/judge0/submissions?wait=true`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...submissionBody, userId })
            }
        );

        if (!response.ok) {
            throw new Error(`Error in request to Judge0, Status: ${response.status}`);
        }

        const data: CodeSubmissionRES = await response.json();
        return {
            error: false,
            data
        };

    } catch (err) {
        return {
            error: true,
            message: err instanceof Error ? err.message : "Unknown error occurred"
        };
    }

}