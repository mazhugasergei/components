import { Header } from "@/components/ui/header"
import { PageHeader } from "@/components/ui/page-header"
import { components } from "@/lib/constants"
import { preventOrphan, toKebabCase } from "@/utils/text"
import { ChevronRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Components",
	description: "Personal collection of reusable components.",
	keywords: ["components", "react", "ui", "typescript", "next.js"],
	authors: [{ name: "Components" }],
	openGraph: {
		title: "Components",
		description: "Personal collection of reusable components",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Components",
		description: "Personal collection of reusable components",
	},
}

export default function Home() {
	return (
		<>
			<Header title="Components" />

			<main>
				<div className="mx-auto max-w-2xl space-y-12 p-4">
					<PageHeader title="Components" description="Personal collection of reusable components." />

					<div className="space-y-6">
						{components.map((component, index) => {
							const slug = toKebabCase(component.title)
							return (
								<Link
									key={index}
									href={`/${slug}`}
									className="group border-border bg-card hover:bg-accent block rounded-lg border p-6 transition-colors"
								>
									<div className="flex items-center justify-between">
										<div>
											<h2 className="text-foreground group-hover:text-primary font-mono text-lg font-medium">
												{component.title}
											</h2>
											<p className="text-muted-foreground mt-1 text-sm">{preventOrphan(component.description)}</p>
										</div>
										<ChevronRightIcon className="text-muted-foreground group-hover:text-primary transition-colors" />
									</div>
								</Link>
							)
						})}
					</div>
				</div>
			</main>
		</>
	)
}
