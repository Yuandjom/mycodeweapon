"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { ProblemState, ProblemStatus } from "@/types/problem";
import { convertIsoTimeToUnix, getCurrentUTCTime } from "@/utils/timestamp";
import { SimpleResponse } from "@/types/global";

export const useProblem = (title: string, user: User | null) => {
  const DEFAULT_PROBLEM_STATE: ProblemState = {
    id: "-1",
    userId: user?.id || "-",
    status: ProblemStatus.InProgress,
    code: "# your code here", //TODO: make this dynamic based on languageId
    languageId: "71", // python's language Id
    title: "untitled",
    description: "",
    hints: "",
    updated_at: "",
  };

  const [problemStates, setProblemStates] = useState<ProblemState>(
    DEFAULT_PROBLEM_STATE
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // utility function
  const updateProblemStates = (newStates: Partial<ProblemState>) => {
    setProblemStates((prev) => ({
      ...prev,
      ...newStates,
    }));
  };

  const setTitle = async (title: string): Promise<SimpleResponse> => {
    updateProblemStates({ title: title.trim().toLowerCase() });

    return {
      success: true,
      message: "",
    };
  };

  const setStatus = (status: ProblemStatus) => {
    updateProblemStates({ status });
  };

  const setDescription = (description: string) => {
    updateProblemStates({ description });
  };

  const setHints = (hints: string) => {
    updateProblemStates({ hints });
  };

  const setCode = (code: string) => {
    updateProblemStates({ code });
    saveCodeLocally(problemStates.id, code);
  };

  const setLanguageId = (languageId: string) => {
    updateProblemStates({ languageId });
  };

  const resetProblem = () => {
    updateProblemStates(DEFAULT_PROBLEM_STATE);
    setError(null);
    setIsLoading(false);
  };

  return {
    problemStates,

    setTitle,
    setDescription,
    setHints,
    setStatus,
    setCode,
    setLanguageId,
    resetProblem,

    isLoading,
    error,
  };
};

// utility functions

/*
  Since old user's code may be cached in local storage, we compare which is later version and use it
  
  Note: If user previously saved code to cloud in device B and logs into device A with "older" code, we will overwrite A's local storage with server code
*/
const handleProblemCodeConflicts = (
  problemId: string,
  serverUpdatedTimeIso: string,
  code: string
) => {
  const key = getLocalStorageKey(problemId);

  const serverLastUpdated = convertIsoTimeToUnix(serverUpdatedTimeIso);
  const localLastUpdated = Number(localStorage.getItem(`${key}-updated`)) || 0;

  // server has newer code so overwrite local storage with it
  if (localLastUpdated < serverLastUpdated) {
    saveCodeLocally(problemId, code);
  } else {
  }
};

const saveCodeLocally = (problemId: string, code: string) => {
  const key = getLocalStorageKey(problemId);

  localStorage.setItem(`${key}-code`, code);
  localStorage.setItem(`${key}-updated`, String(getCurrentUTCTime()));
};

const getCodeLocally = (problemId: string): string => {
  const key = getLocalStorageKey(problemId);

  const cachedCode = localStorage.getItem(`${key}-code`);

  return cachedCode || "";
};

const deleteCodeLocally = (problemId: string) => {
  const key = getLocalStorageKey(problemId);

  localStorage.removeItem(`${key}-code`);
  localStorage.removeItem(`${key}-updated`);
};

const getLocalStorageKey = (problemId: string): string => {
  if (problemId !== "-1") {
    return `problem-${problemId}`;
  }
  return "problem-unsaved";
};
