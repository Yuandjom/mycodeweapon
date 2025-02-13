import type { Metadata } from "next";
import ProblemsTable from "@/components/problem/ProblemsTable";

export const metadata: Metadata = {
  title: "Problems",
};

export default function ProblemsPage() {
  return (
    <div className="w-full flex justify-center items-start pt-10">
      <ProblemsTable />
    </div>
  );
}
