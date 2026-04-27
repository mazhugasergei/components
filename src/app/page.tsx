"use client"

import { Header } from "@/components/header"
import { Paragraph } from "@/components/paragraph"
import { ScrollArea } from "@/components/ui/scroll-area"
import { components } from "@/lib/constants"
import { preventOrphan, toKebabCase } from "@/utils/text"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const categories = ["All", "Animation", "Input", "Navigation"]

export default function Home() {
	const [selectedCategory, setSelectedCategory] = useState("All")

	const filteredComponents = components.filter((component) =>
		selectedCategory === "All" ? true : component.tag === selectedCategory
	)

	return (
		<div className="h-100dvh">
			<ScrollArea className="h-full">
				<Header />

				<main className="mx-auto max-w-3xl px-8 pt-20 xl:max-w-4xl">
					{/* Hero */}
					<section className="mb-20">
						<p className="text-muted-foreground mb-4 text-sm tracking-widest uppercase">Open source</p>
						<h1 className="mb-6 text-3xl leading-snug font-medium">
							Reusable components,
							<br />
							dependency-free.
						</h1>
						<Paragraph className="text-muted-foreground max-w-md text-pretty">
							{preventOrphan(
								"A personal collection of copy-paste ready UI primitives. Built with Next.js, TypeScript, and Tailwind CSS."
							)}
						</Paragraph>
					</section>

					<div className="mb-12 flex flex-wrap gap-3">
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setSelectedCategory(cat)}
								className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
									selectedCategory === cat
										? "bg-foreground text-background border-foreground"
										: "text-muted-foreground hover:text-foreground hover:border-foreground/40 border"
								}`}
							>
								{cat}
							</button>
						))}
					</div>

					<div className="bg-border grid gap-px overflow-hidden rounded-xl border sm:grid-cols-2">
						{filteredComponents.map((component) => (
							<Link
								key={component.title}
								href={"/" + toKebabCase(component.title)}
								className="group bg-background hover:bg-muted/50 flex flex-col gap-2 p-6 transition-colors"
							>
								<span className="text-muted-foreground text-xs tracking-widest uppercase">{component.tag}</span>
								<span className="text-foreground font-medium">{component.title}</span>
								<span className="text-muted-foreground text-sm leading-relaxed text-pretty">
									{preventOrphan(component.description)}
								</span>
								<div className="mt-auto flex items-center justify-between pt-4">
									<span className="text-muted-foreground/70 text-xs">
										{component.codeBlocks.length - 1} {component.codeBlocks.length - 1 === 1 ? "file" : "files"}
									</span>
									<span className="text-muted-foreground group-hover:text-foreground text-sm transition-all group-hover:translate-x-0.5">
										<ChevronRightIcon className="size-4" />
									</span>
								</div>
							</Link>
						))}
					</div>

					<footer className="mt-20 flex items-center justify-between border-t py-8">
						<span className="text-muted-foreground text-sm">{components.length} components</span>
						<div className="flex gap-6">
							{["Next.js", "TypeScript", "Tailwind CSS"].map((tech) => (
								<span key={tech} className="text-muted-foreground text-sm">
									{tech}
								</span>
							))}
						</div>
					</footer>
				</main>
			</ScrollArea>
		</div>
	)
}
