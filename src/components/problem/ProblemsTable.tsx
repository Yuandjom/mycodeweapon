"use client";

import {
  getProblemColumns,
  COLUMN_SIZES,
} from "@/components/table/problem_column";
import { DataTable } from "@/components/ui/data-table";
import { useAuth } from "@/providers/auth-provider";
import { useProblemsTable } from "@/hooks/useProblemsTable";
import { useRouter } from "next/navigation";

export default function ProblemsTable() {
  const { authLoading, user } = useAuth();
  const router = useRouter();

  if (!authLoading && !user) {
    router.push("/signin");
    return;
  }

  const { problemsData, deleteProblem } = useProblemsTable(user);

  const problem_columns = getProblemColumns(deleteProblem);

  return (
    <DataTable
      columns={problem_columns}
      data={problemsData}
      columnSizes={COLUMN_SIZES}
      deleteRow={deleteProblem}
    />
  );
}
