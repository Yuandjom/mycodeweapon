import Hero from "@/components/root/Hero";
import LlmSupport from "@/components/root/LlmSupport";
import LanguageSupport from "@/components/root/LanguageSupport";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-8 min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="w-full">
        <Hero />

        <div id="llm-support" className="w-full">
          <LlmSupport />
        </div>

        <div id="language-support" className="w-full">
          <LanguageSupport />
        </div>
      </main>
    </div>
  );
}
