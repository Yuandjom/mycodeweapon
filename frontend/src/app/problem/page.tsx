"use client"

import { problem_columns, COLUMN_SIZES } from "@/components/table/problem_column"
import { DataTable } from "@/components/ui/data-table"
import { useAuth } from "@/providers/auth-provider"
import { useProblemsTable } from "@/hooks/useProblemsTable"
import { useRouter } from "next/navigation"


export default function ProblemsPage() {

  const { authLoading, user } = useAuth();
  const router = useRouter();

  if (!authLoading && !user) {
    router.push("/signin")
  }

  const { problemsData } = useProblemsTable(user);

  return (
    <div className="w-full flex justify-center items-start py-10">
      <DataTable
        columns={problem_columns}
        data={problemsData}
        columnSizes={COLUMN_SIZES}
      />
    </div>

  )
}
