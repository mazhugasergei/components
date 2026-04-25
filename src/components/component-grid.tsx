"use client"

import { ComponentCard } from "@/components/component-card"
import { components } from "@/lib/constants"
import { toKebabCase } from "@/utils/text"
import { useState } from "react"

export function ComponentGrid() {
	const [searchQuery, setSearchQuery] = useState("")

	const filteredComponents = components.filter(
		(component) =>
			component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			component.description.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<div className="space-y-6">
			<div className="relative">
				<svg
					className="text-muted-foreground absolute top-1/2 h-4 w-4 -translate-y-1/2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					placeholder="Search components..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="border-input bg-background placeholder:text-muted-foreground w-full border-0 border-b py-2 pl-7 text-sm focus:outline-none"
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{filteredComponents.map((component, index) => (
					<ComponentCard
						key={index}
						href={"/" + toKebabCase(component.title)}
						title={component.title}
						description={component.description}
						codeBlocksCount={component.codeBlocks.length - 1}
					/>
				))}
			</div>

			{filteredComponents.length === 0 && (
				<div className="py-12 text-center">
					<p className="text-muted-foreground">No components found matching "{searchQuery}"</p>
				</div>
			)}
		</div>
	)
}
