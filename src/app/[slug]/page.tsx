import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { processCodeBlocks } from "@/lib/code-loader"
import { toKebabCase } from "@/utils/text"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const processedComponents = await processCodeBlocks()
	const component = processedComponents.find((item) => toKebabCase(item.title) === slug)
	if (!component) return notFound()

	return (
		<>
			<Header className="max-lg:hidden" />

			<main className="mx-auto max-w-3xl flex-1 px-8 pb-8 xl:max-w-4xl">
				<PageHeader title={component.title} description={component.description} />

				<div className="space-y-8">
					<div className="bg-card grid place-content-center rounded-lg border p-10">{component.examples[0]}</div>

					<div className="space-y-6">
						{component.codeBlocks.map((block, index) => (
							<div key={index} className="bg-card rounded-lg border">
								<div className="flex items-center justify-between gap-2 p-1 pl-3 text-xs">
									<span className="text-muted-foreground text-right font-mono">{block.filePath}</span>
									<CopyButton text={block.highlightedCode.replace(/<[^>]*>/g, "")} />
								</div>
								<CodeBlock highlightedCode={block.highlightedCode} themeBackground={block.themeBackground} />
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	)
}
