"use client"

import { components } from "@/lib/constants"
import { cn } from "@/utils/classname"
import { toKebabCase } from "@/utils/text"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { buttonVariants } from "./button"

interface Props extends React.ComponentProps<"aside"> {
	backHref?: string | "~"
}

const LINKS = [
	{
		href: "/",
		label: "Home",
	},
	...components.map((component) => ({
		href: `/${toKebabCase(component.title)}`,
		label: component.title,
	})),
]

export function Aside({ backHref, className, ...props }: Props) {
	const pathname = usePathname()
	const [href, setHref] = useState<string | undefined>(backHref)

	useEffect(() => {
		if (backHref === "~") setHref(typeof window !== "undefined" ? window.location.origin.replace(/\/[^/]*$/, "") : "/")
	}, [backHref])

	return (
		<aside className={cn("border-r", className)} {...props}>
			<div className="sticky top-0 space-y-4 py-4">
				<Link
					href="/"
					className={buttonVariants({
						variant: "transparent",
						className: "text-foreground font-mono text-lg font-medium",
					})}
				>
					Components
				</Link>

				<ul className="space-y-1">
					{LINKS.map((link, index) => {
						const isActive = pathname === link.href

						return (
							<li key={index}>
								<Link
									href={link.href}
									className={buttonVariants({
										variant: "transparent",
										className: cn("w-full justify-start", isActive && "text-foreground!"),
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
