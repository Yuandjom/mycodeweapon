"use client"

import { columns } from "@/components/table/problem"
import { ProblemState } from "@/types/problem"
import { DataTable } from "@/components/ui/data-table"
import { useAuth } from "@/providers/auth-provider"
import { useProblemsTable } from "@/hooks/useProblemsTable"
import { useRouter } from "next/navigation"


export default function DemoPage() {

  const { authLoading, user } = useAuth();
  const router = useRouter();

  if (!authLoading && !user) {
    router.push("/signin")
  }

  const { problemsData } = useProblemsTable(user);

  return (
    <div className="container mx-auto py-10">

      <DataTable columns={columns} data={problemsData} />
    </div>
    
  )
}
