import { cn } from "@/utils/classname"

interface PageHeaderProps {
	title: string
	description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<div className="space-y-2">
			<h1 className={cn("font-mono text-2xl font-bold text-stone-900")}>{title}</h1>
			<p className="text-sm text-stone-600">{description}</p>
		</div>
	)
}
