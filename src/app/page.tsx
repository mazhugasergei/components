import { ComponentGrid } from "@/components/component-grid"
import { PageHeader } from "@/components/page-header"

export default function Home() {
	return (
		<main className="from-background via-background to-muted/20 min-h-screen bg-linear-to-br">
			<div className="mx-auto max-w-4xl px-4 py-16">
				<PageHeader
					title="Components"
					description="Personal collection of reusable components. Dependency-free. Copy-paste ready."
					className="py-12 text-center"
				/>

				<ComponentGrid />

				<div className="mt-16 text-center">
					<p className="text-muted-foreground text-sm">Built with Next.js, TypeScript, and Tailwind CSS</p>
				</div>
			</div>
		</main>
	)
}
