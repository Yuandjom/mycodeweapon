import ProblemPage from "@/components/problem/ProblemPage";

export default async function Page({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const title = (await params).title;

  return <ProblemPage title={title} />;
}
