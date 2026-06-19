import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { Header } from "@/components/header"
import { PageHeader } from "@/components/page-header"
import { processCodeBlocks } from "@/lib/code-loader"
import { cn } from "@/utils/classname"
import { toKebabCase } from "@/utils/text"
import { LightbulbIcon } from "lucide-react"
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
					<div className="bg-card flex justify-center rounded-lg border p-10">{component.examples[0]}</div>

					{component.notice && (
						<div className="bg-card text-muted-foreground flex gap-3 rounded-lg border px-4 py-3">
							<LightbulbIcon size={15} className="mt-0.5 shrink-0" />
							<p className="text-sm leading-relaxed [&_a]:underline [&_a]:underline-offset-2">{component.notice}</p>
						</div>
					)}

					<div className="space-y-6">
						{component.codeBlocks.map((block, index) => {
							const textToCopy = block.highlightedCode.replace(/<[^>]*>/g, "")
							return (
								<div key={index} className={cn("relative rounded-lg", block.filePath && "bg-card border")}>
									{block.filePath ? (
										<div className="grid grid-cols-[1fr_auto] items-center justify-between gap-2 p-1 pl-3 text-xs">
											<span className="text-muted-foreground overflow-hidden font-mono text-ellipsis whitespace-nowrap">
												{block.filePath}
											</span>
											<CopyButton text={textToCopy} />
										</div>
									) : (
										<CopyButton text={textToCopy} className="absolute top-1 right-1 z-10" />
									)}
									<CodeBlock
										highlightedCode={block.highlightedCode}
										themeBackground={block.themeBackground}
										className={cn(block.filePath && "-mx-px -mb-px")}
									/>
								</div>
							)
						})}
					</div>
				</div>
			</main>
		</>
	)
}
