import { useState } from "react"
import { ComponentCode } from "./component-code"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

interface ComponentSectionProps {
	title: string
	description: string
	badgeColor: "blue" | "green" | "stone"
	children: React.ReactNode
	codeBlocks?: Array<{
		title: string
		code: string
		filePath?: string
	}>
}

export function ComponentSection({
	title,
	description,
	badgeColor = "stone",
	children,
	codeBlocks,
}: ComponentSectionProps) {
	const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")

	return (
		<div className="space-y-4">
			<div className="mb-4">
				<h2 className="text-foreground font-mono text-lg font-medium">{title}</h2>
			</div>
			<p className="text-muted-foreground text-sm">{description}</p>

			<Tabs>
				<TabsList>
					<TabsTrigger isActive={activeTab === "preview"} onClick={() => setActiveTab("preview")}>
						Preview
					</TabsTrigger>
					<TabsTrigger isActive={activeTab === "code"} onClick={() => setActiveTab("code")}>
						Code
					</TabsTrigger>
				</TabsList>

				<TabsContent isActive={activeTab === "preview"}>
					<div className="border-border bg-card rounded-md border p-4">{children}</div>
				</TabsContent>

				<TabsContent isActive={activeTab === "code"}>
					<ComponentCode codeBlocks={codeBlocks || []} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
