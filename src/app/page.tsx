import { ComponentCard } from "@/components/component-card"
import { PageHeader } from "@/components/ui/page-header"
import { components } from "@/lib/constants"
import { toKebabCase } from "@/utils/text"

export default function Home() {
	return (
		<main className="from-background via-background to-muted/20 min-h-screen bg-linear-to-br">
			<div className="mx-auto max-w-4xl px-4 py-16">
				<PageHeader
					title="Components"
					description="Personal collection of reusable components."
					className="py-12 text-center"
				/>

				<div className="grid gap-6 md:grid-cols-2">
					{components.map((component, index) => (
						<ComponentCard
							key={index}
							href={`/${toKebabCase(component.title)}`}
							title={component.title}
							description={component.description}
							codeBlocksCount={component.codeBlocks.length}
						/>
					))}
				</div>

				<div className="mt-16 text-center">
					<p className="text-muted-foreground text-sm">Built with Next.js, TypeScript, and Tailwind CSS</p>
				</div>
			</div>
		</main>
	)
}
