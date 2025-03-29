import type { Metadata } from "next";
import ProblemsTable from "@/components/problem/ProblemsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Problems",
};

export default function ProblemsPage() {
  return (
    <div className="w-full flex justify-center items-start pt-10">
      <Button variant="secondary" className="">
        <Link href="/problem/new">+ New Problem</Link>
      </Button>
    </div>
  );
}
