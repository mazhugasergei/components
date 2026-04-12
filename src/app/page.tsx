import { LayoutHeader } from "@/components/ui/layout-header"
import { PageHeader } from "@/components/ui/page-header"
import { components } from "@/lib/constants"
import Link from "next/link"

export default function Home() {
	return (
		<div>
			<LayoutHeader title="Animated Components" />
			<div className="mx-auto max-w-2xl space-y-12 p-8">
				<PageHeader title="Components" description="Examples of smooth dimension animations using React and Motion" />

				<div className="space-y-6">
					{components.map((component, index) => {
						const getSlug = (title: string) => {
							return title
								.replace(/([A-Z])/g, "-$1")
								.replace(/^-/, "")
								.toLowerCase()
						}

						const slug = getSlug(component.title)
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
										<p className="text-muted-foreground mt-1 text-sm">{component.description}</p>
									</div>
									<div className="text-muted-foreground group-hover:text-primary transition-colors">
										<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</div>
								</div>
							</Link>
						)
					})}
				</div>
			</div>
		</div>
	)
}
