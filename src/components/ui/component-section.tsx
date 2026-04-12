"use client"

import { CodeBlock } from "@/components/ui/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

interface ComponentSectionProps extends React.ComponentProps<"section"> {
	title: string
	description: string
	examples?: React.ReactNode[]
	codeBlocks?: Array<{
		title: string
		code?: string
		codeUrl?: string
		filePath?: string
	}>
}

export function ComponentSection({
	title,
	description,
	examples = [],
	codeBlocks = [],
	...props
}: ComponentSectionProps) {
	const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")

	return (
		<section {...props}>
			<h2 className="text-foreground font-mono text-xl font-bold">{title}</h2>
			<p className="text-muted-foreground mt-2 text-sm">{description}</p>

			<Tabs className="mt-4">
				<TabsList>
					<TabsTrigger isActive={activeTab === "preview"} onClick={() => setActiveTab("preview")}>
						Preview
					</TabsTrigger>
					<TabsTrigger isActive={activeTab === "code"} onClick={() => setActiveTab("code")}>
						Code
					</TabsTrigger>
				</TabsList>

				<TabsContent isActive={activeTab === "preview"} className="space-y-2">
					{examples.map((example, index) => (
						<div key={index} className="border-border bg-card rounded-md border p-4">
							{example}
						</div>
					))}
				</TabsContent>

				<TabsContent isActive={activeTab === "code"}>
					<div className="space-y-3">
						{codeBlocks.map((block, index) => (
							<div key={index} className="space-y-2">
								<div className="flex items-center justify-between gap-2">
									<h5 className="text-foreground font-mono text-xs font-medium">{block.title}</h5>
									<span className="text-muted-foreground text-right font-mono text-xs">
										{block.filePath || block.codeUrl}
									</span>
								</div>
								<CodeBlock block={block} />
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</section>
	)
}
