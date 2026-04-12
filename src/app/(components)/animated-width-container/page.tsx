import { CodeBlock } from "@/components/ui/code-block"
import { LayoutHeader } from "@/components/ui/layout-header"
import { PageHeader } from "@/components/ui/page-header"
import { components } from "@/lib/constants"

const component = components.find((c) => c.title === "AnimatedWidthContainer")

export default function Page() {
	if (!component) return <div>Component not found</div>

	return (
		<div>
			<LayoutHeader title={component.title} showBackButton />
			<div className="mx-auto max-w-2xl space-y-12 p-8">
				<PageHeader title={component.title} description={component.description} />

				<div className="space-y-8">
					<div className="border-border bg-card rounded-lg border p-4">{component.examples[0]}</div>

					<div className="space-y-6">
						{component.codeBlocks.map((block, index) => (
							<div key={index} className="space-y-2">
								<div className="flex items-center justify-between gap-2">
									<h3 className="text-foreground font-mono text-sm font-medium">{block.title}</h3>
									<span className="text-muted-foreground text-right font-mono text-xs">
										{block.filePath || block.codeUrl}
									</span>
								</div>
								<CodeBlock block={block} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
