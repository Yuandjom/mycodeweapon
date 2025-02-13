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

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center pb-10">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/LimJiaEarn/mycodeweapon"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/mycodeweaponlogo.svg"
            alt="logo"
            width={16}
            height={16}
          />
          Contribute →
        </a>
      </footer>
    </div>
  );
}
