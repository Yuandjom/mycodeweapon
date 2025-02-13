import { Compare } from "@/components/ui/compare";

export default function CompareCard({ theme }: { theme: string | undefined }) {
  return (
    <div className="p-1.5 border rounded-t-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 m-4">
      <Compare
        firstImage={`/codeDemoLeft_${theme === "dark" ? "dark" : "light"}.png`}
        secondImage={`/codeDemoRight_${theme === "dark" ? "dark" : "light"}.png`}
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="h-[250px] w-full"
        slideMode="hover"
        autoplay
      />
    </div>
  );
}
