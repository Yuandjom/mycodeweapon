"use client";

import { useState, useEffect } from "react";
import { ProblemState } from "@/types/problem";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { PROBLEMS_TABLE } from "@/constants/supabase";

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

        console.log("[useProblemsTable] fetchData:");
        console.log(data);

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

  return {
    isLoadingData,
    loadDataError,
    problemsData,
  };
};
