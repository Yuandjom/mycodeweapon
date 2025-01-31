import ProblemPage from "@/components/problem/ProblemPage";

type MetadataProps = {
  params: Promise<{ title: string }>
}

export async function generateMetadata({ params }: MetadataProps) {

  const title = (await params).title

  const capTitle = title.replace('-', ' ').split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    title: `${capTitle}`
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ title: string }>
}) {
  const title = (await params).title


  return (
    <ProblemPage title={title} />
  )

}