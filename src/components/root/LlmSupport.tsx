"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface supportLlmsType {
  name: string;
  icon: string;
}

const supportLlms: supportLlmsType[] = [
  {
    name: "Gemini",
    icon: "gemini.svg",
  },
  {
    name: "DeepSeek",
    icon: "deepseek.svg",
  },
  {
    name: "Claude",
    icon: "claude.svg",
  },
  {
    name: "OpenAI",
    icon: "openai.svg",
  },
  {
    name: "Perplexity",
    icon: "perplexity.svg",
  },
];

const LlmSupport = () => {
  const [hoveredLlm, setHoveredLlm] = useState<string | null>(null);

  return (
    <section className="w-full max-w-6xl mx-auto px-8 lg:px-4 py-12 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
          Powered by
        </h2>
        <h3 className="text-xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground text-center">
          {hoveredLlm || "the most advanced models!"}
        </h3>
      </div>

      {/* Icons grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-6 md:gap-10">
        {supportLlms.map((llm, i) => (
          <motion.div
            key={`llm-support-${i}`}
            onMouseEnter={() => setHoveredLlm(llm.name)}
            onMouseLeave={() => setHoveredLlm(null)}
            className="relative group"
            whileHover={{ scale: 1.1 }}
            initial={{ y: 50, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: i * 0.1 },
            }}
          >
            <div className="flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 hover:bg-secondary/50 cursor-pointer">
              <Image
                src={`/companyIcons/${llm.icon}`}
                alt={llm.name}
                height={56}
                width={56}
                className="transition-transform duration-300 rounded-full"
              />
              <p className="mt-2 text-sm font-medium">{llm.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LlmSupport;
