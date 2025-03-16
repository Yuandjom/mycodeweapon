"use client";

import { useState, useEffect } from "react";
import { ProblemState } from "@/types/problem";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { PROBLEM_IMAGE_BUCKET, PROBLEMS_TABLE } from "@/constants/supabase";
import { SimpleResponse } from "@/types/global";

export const useProblemsTable = (user: User | null) => {
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [loadDataError, setLoadDataError] = useState<Error | null>(null);
  const [problemsData, setProblemsData] = useState<ProblemState[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }

      setIsLoadingData(true);

      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from(PROBLEMS_TABLE)
          .select()
          .eq("userId", user?.id);

        if (error) {
          console.log(error);
          throw error;
        }

        setProblemsData(data);
      } catch (err) {
        setLoadDataError(
          err instanceof Error ? err : new Error("Error in fetching data")
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const deleteProblem = async (
    problemData: ProblemState
  ): Promise<SimpleResponse> => {
    try {
      const supabase = createClient();
      const { error: error1 } = await supabase
        .from(PROBLEMS_TABLE)
        .delete()
        .eq("id", problemData.id);

      if (error1) {
        throw new Error(`Error in deletion in table: ${error1}`);
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: `Issue deleting ${problemData.title}, please try again later!`,
      };
    }

    return {
      success: true,
      message: `Successfully deleted ${problemData.title}`,
    };
  };

  return {
    isLoadingData,
    loadDataError,
    problemsData,
    deleteProblem,
  };
};
