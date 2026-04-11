import { cn } from "@/utils/classname"

interface ComponentSectionProps {
	title: string
	description: string
	technique: string
	badgeColor: "blue" | "green" | "stone"
	children: React.ReactNode
}

export function ComponentSection({
	title,
	description,
	technique,
	badgeColor = "stone",
	children,
}: ComponentSectionProps) {
	const badgeColors = {
		blue: "bg-blue-100 text-blue-800",
		green: "bg-green-100 text-green-800",
		stone: "bg-stone-100 text-stone-800",
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className={cn("rounded px-2 py-1 font-mono text-xs", badgeColors[badgeColor])}>{title}</span>
				<span className="text-xs text-stone-500">{technique}</span>
			</div>
			<p className="text-sm text-stone-600">{description}</p>
			<div className="rounded border border-stone-200 bg-stone-50 p-4">{children}</div>
		</div>
	)
}
