"use client"

import { components } from "@/lib/constants"
import { cn } from "@/utils/classname"
import { toKebabCase } from "@/utils/text"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "./button"

const LINKS = components.map((component) => ({
	href: `/${toKebabCase(component.title)}`,
	label: component.title,
}))

export function Aside({ className, ...props }: React.ComponentProps<"aside">) {
	const pathname = usePathname()

	return (
		<aside className={cn("border-r", className)} {...props}>
			<div className="sticky top-0 space-y-4 py-4">
				<Link
					href="/"
					className={buttonVariants({
						variant: "transparent",
						className: "text-foreground! font-mono text-lg font-medium",
					})}
				>
					Components
				</Link>

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
			</div>
		</aside>
	)
}
