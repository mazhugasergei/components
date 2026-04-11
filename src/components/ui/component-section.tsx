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
		blue: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
		green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
		stone: "bg-muted text-muted-foreground",
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className={cn("rounded px-2 py-1 font-mono text-xs", badgeColors[badgeColor])}>{title}</span>
				<span className="text-muted-foreground text-xs">{technique}</span>
			</div>
			<p className="text-muted-foreground text-sm">{description}</p>
			<div className="border-border bg-card rounded border p-4">{children}</div>
		</div>
	)
}
