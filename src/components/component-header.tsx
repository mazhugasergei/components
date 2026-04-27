import { cn } from "@/utils/classname"
import { ComponentProps } from "react"
import { BackButton } from "./back-button"

interface Props extends ComponentProps<"header"> {
	title?: string
	backHref?: string | "~"
}

export function Header({ title, backHref, className, ...props }: Props) {
	return (
		<header
			className={cn(
				"bg-background/80 backdrop-blur-safe sticky top-0 z-50 flex items-center gap-4 border-b py-2",
				className
			)}
			{...props}
		>
			{backHref && <BackButton href={backHref} />}
			{title && <span className="truncate font-medium">{title}</span>}
		</header>
	)
}
