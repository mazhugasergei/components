import { Paragraph } from "@/components/paragraph"
import { cn } from "@/utils/classname"

interface Props extends React.ComponentProps<"header"> {
	title: string
	description: string
}

export function PageHeader({ title, description, className, ...props }: Props) {
	return (
		<header className={cn("space-y-2 py-12", className)} {...props}>
			<h1 className={cn("text-3xl leading-snug font-medium")}>{title}</h1>
			<Paragraph className="text-muted-foreground max-w-md text-pretty">{description}</Paragraph>
		</header>
	)
}
