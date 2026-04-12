import { cn } from "@/utils/classname"

interface PageHeaderProps {
	title: string
	description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<div className="space-y-2">
			<h1 className={cn("text-foreground font-mono text-3xl font-bold")}>{title}</h1>
			<p className="text-muted-foreground text-sm">{description}</p>
		</div>
	)
}
