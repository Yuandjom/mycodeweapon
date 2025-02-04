"use client"

import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type supportLanguagesType = {
	lang: string,
	icon: string,
}
const supportLanguages: supportLanguagesType[] = [
	{ "lang": "Python", "icon": "python.svg" },
	{ "lang": "C", "icon": "c.svg" },
	{ "lang": "C++", "icon": "cpp.svg" },
	{ "lang": "C#", "icon": "csharp.svg" },
	{ "lang": "Java", "icon": "java.svg" },
	{ "lang": "Javascript", "icon": "javascript.svg" },
	{ "lang": "Typescript", "icon": "typescript.svg" },
	{ "lang": "Go", "icon": "go.svg" },
	{ "lang": "Kotlin", "icon": "kotlin.svg" },
	{ "lang": "Lua", "icon": "lua.svg" },
	{ "lang": "Perl", "icon": "perl.svg" },
	{ "lang": "Ruby", "icon": "ruby.svg" },
	{ "lang": "Rust", "icon": "rust.svg" },
	{ "lang": "Swift", "icon": "swift.svg" },
]

const LanguageSupport = () => {
	const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null)

	return (
		<section className="w-full max-w-6xl mx-auto px-8 lg:px-4 py-16 space-y-8">
			{/* Title container */}
			<div className="flex flex-col space-y-2">
				<h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-center">
					We support
				</h2>
				<h3 className="text-xl md:text-3xl font-semibold text-muted-foreground text-center">
					{hoveredLanguage || "your favourite languages!"}
				</h3>
			</div>

			{/* Icons grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
				{supportLanguages.map((sl, i) => (
					<motion.div
						key={`hero-sl-${i}`}
						onMouseEnter={() => setHoveredLanguage(sl.lang)}
						onMouseLeave={() => setHoveredLanguage(null)}
						className="relative group"
						whileHover={{ scale: 1.05 }}
						initial={{ x: 300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -300, opacity: 0 }}
					>
						<div className="flex items-center justify-center p-4 rounded-lg transition-all duration-300 hover:bg-secondary/50 cursor-pointer">
							<Image
								src={`/langIcons/${sl.icon}`}
								alt={sl.lang}
								height={48}
								width={48}
								className="transition-transform duration-300"
							/>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	)
}

export default LanguageSupport