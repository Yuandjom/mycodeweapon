"use server";

import { CodeSubmissionREQ, CodeSubmissionRES } from "@/types/judge0";
import { AvailLanguage } from "@/types/judge0";

export const submitCode_SA = async (
  submissionBody: CodeSubmissionREQ,
  userId: string
) => {
  try {
    const response = await fetch(
      `${process.env.JUDGE0_API_GATEWAY}/judge0/submissions?wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        body: JSON.stringify(submissionBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Error in request to Judge0, Status: ${response.status}`);
    }

    const data: CodeSubmissionRES = await response.json();

    return {
      error: false,
      data,
    };
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
};

export const getAvailableLanguages_SA = async (
  userId: string
): Promise<AvailLanguage[]> => {
  try {
    const response = await fetch(`${process.env.JUDGE0_URL}/languages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      },
    });

    if (!response.ok) {
      console.log("[getAvailableLanguages_SA] error");
      throw new Error(
        `HTTP Error in request to Judge0, Status: ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.log("Error in fetching languages: ", err);
  }

  return [];
};
