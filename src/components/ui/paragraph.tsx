import { cn } from "@/utils/classname"
import { preventOrphan } from "@/utils/text"

interface Props {
	children: React.ReactNode
	className?: string
}

export function Paragraph({ children, className }: Props) {
	const textContent = typeof children === "string" ? preventOrphan(children) : children
	return <p className={cn("text-sm leading-relaxed", className)}>{textContent}</p>
}
