"use client"

import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { components } from "@/lib/constants"
import { cn } from "@/utils/classname"
import { toKebabCase } from "@/utils/text"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = components.map((component) => ({
	href: "/" + toKebabCase(component.title),
	label: component.title,
}))

export function Aside({ className, ...props }: React.ComponentProps<"aside">) {
	const pathname = usePathname()

	return (
		<aside className={cn("flex flex-col border-r", className)} {...props}>
			<Link
				href="/"
				className={buttonVariants({
					variant: "transparent",
					className: "text-foreground! my-4 self-start font-mono font-bold",
				})}
			>
				Components
			</Link>

			<ScrollArea>
				<ul>
					{LINKS.map((link, index) => {
						const isActive = pathname === link.href

						return (
							<li key={index}>
								<Link
									href={link.href}
									className={buttonVariants({
										variant: "transparent",
										className: cn("w-full justify-start font-mono", isActive && "text-foreground! underline"),
									})}
								>
									{link.label}
								</Link>
							</li>
						)
					})}
				</ul>
			</ScrollArea>
		</aside>
	)
}
