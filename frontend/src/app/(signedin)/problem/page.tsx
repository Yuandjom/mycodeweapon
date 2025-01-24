import type { Metadata } from "next";
import ProblemsTable from "@/components/problem/ProblemsTable";

export const metadata: Metadata = {
  title: "Problems"
}

export default function ProblemsPage() {

  return (
    <div className="w-full flex_center">
      <ProblemsTable />
    </div>

  )
}
