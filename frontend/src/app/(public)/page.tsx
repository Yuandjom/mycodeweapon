import Image from "next/image";
import { Hero } from "@/components/root/Hero";
import LanguageSupport from "@/components/root/LanguageSupport";
import BentoBox from "@/components/root/BentoBox";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center gap-8 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="w-full">
        <div id="hero" className="w-full">
          <Hero />
        </div>

        <div id="features" className="w-full">
          <BentoBox />
        </div>

        <div id="language-support" className="w-full">
          <LanguageSupport />
        </div>
      </main>
    </div>
  );
}
