import { cn } from "@/utils/classname"
import { preventOrphan } from "@/utils/text"

interface ParagraphProps {
	children: React.ReactNode
	className?: string
}

export function Paragraph({ children, className }: ParagraphProps) {
	const textContent = typeof children === "string" ? preventOrphan(children) : children
	return <p className={cn("text-sm leading-relaxed", className)}>{textContent}</p>
}
