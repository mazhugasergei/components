import { LayoutHeader } from "@/components/ui/layout-header"
import { PageHeader } from "@/components/ui/page-header"
import { components } from "@/lib/constants"
import { preventOrphan } from "@/utils/text"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

export default function Home() {
	return (
		<div>
			<LayoutHeader title="Animated Components" />
			<div className="mx-auto max-w-2xl space-y-12 p-8">
				<PageHeader title="Components" description="Personal collection of reusable components." />

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
										<p className="text-muted-foreground mt-1 text-sm">{preventOrphan(component.description)}</p>
									</div>
									<ChevronRightIcon className="text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
							</Link>
						)
					})}
				</div>
			</div>
		</div>
	)
}
