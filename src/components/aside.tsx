"use client"

import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { components } from "@/lib/constants"
import { cn } from "@/utils/classname"
import { toKebabCase } from "@/utils/text"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoLink } from "./logo"

const LINKS = components.map((component) => ({
	href: "/" + toKebabCase(component.title),
	label: component.title,
}))

export function Aside({ className, ...props }: React.ComponentProps<"aside">) {
	const pathname = usePathname()

	return (
		<aside className={cn("flex flex-col border-r", className)} {...props}>
			<LogoLink
				className={buttonVariants({
					variant: "transparent",
					className: "text-foreground! my-4 self-start",
				})}
			>
				Components
			</LogoLink>

			<ScrollArea className="h-full">
				<ul>
					{LINKS.map((link, index) => {
						const isActive = pathname === link.href

						return (
							<li key={index} className="flex flex-col items-start">
								{!!index &&
									Array.from({ length: 3 }).map((_, i) => (
										<div
											key={i}
											className={buttonVariants({
												variant: "transparent",
												className: cn("pointer-events-none h-0.25! py-0!", !!i && "mt-2"),
											})}
										>
											<span className="block h-0.25 w-1 bg-white/40" />
										</div>
									))}

								<Link
									href={link.href}
									className={buttonVariants({
										variant: "transparent",
										className: cn("-my-2 h-auto w-full justify-start py-2! font-mono", isActive && "text-foreground!"),
									})}
								>
									<span className={cn("block h-0.25", isActive ? "w-3 bg-white" : "w-2 bg-white/40")} />
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
