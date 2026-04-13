import { CodeBlock } from "@/components/ui/code-block"
import { LayoutHeader } from "@/components/ui/layout-header"
import { PageHeader } from "@/components/ui/page-header"
import { processCodeBlocks } from "@/lib/code-loader"
import { components } from "@/lib/constants"
import { toKebabCase } from "@/utils/text"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
	return components.map((component) => ({
		slug: toKebabCase(component.title),
	}))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const component = components.find((item) => toKebabCase(item.title) === slug)
	if (!component) return notFound()

	return {
		title: component.title,
		description: component.description,
	}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const processedComponents = await processCodeBlocks()
	const component = processedComponents.find((item) => toKebabCase(item.title) === slug)
	if (!component) return notFound()

	return (
		<main>
			<LayoutHeader title={component.title} showBackButton />
			<div className="mx-auto max-w-2xl space-y-12 p-8">
				<PageHeader title={component.title} description={component.description} />

				<div className="space-y-8">
					<div className="border-border bg-card rounded-lg border p-4">{component.examples[0]}</div>

					<div className="space-y-6">
						{component.codeBlocks.map((block, index) => (
							<div key={index} className="bg-card rounded-lg border">
								<div className="flex items-center justify-between gap-2 px-3 py-1 text-xs">
									<h3 className="text-foreground font-mono font-medium">{block.title}</h3>
									<span className="text-muted-foreground text-right font-mono">{block.filePath}</span>
								</div>
								<CodeBlock
									highlightedCode={block.highlightedCode}
									themeBackground={block.themeBackground}
									className="-m-0.25"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	)
}
