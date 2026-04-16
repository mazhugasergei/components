import { cn } from "@/utils/classname"
import { preventOrphan } from "@/utils/text"

interface Props extends React.ComponentProps<"header"> {
	title: string
	description: string
}

export function PageHeader({ title, description, className, ...props }: Props) {
	return (
		<header className={cn("space-y-2", className)} {...props}>
			<h1 className={cn("text-foreground font-mono text-3xl font-bold")}>{title}</h1>
			<p className="text-muted-foreground text-sm">{preventOrphan(description)}</p>
		</header>
	)
}
