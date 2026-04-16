"use client"

import { buttonVariants } from "@/components/ui/button"
import { components } from "@/lib/constants"
import { cn } from "@/utils/classname"
import { toKebabCase } from "@/utils/text"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface Props extends React.ComponentProps<"div"> {
	backHref?: string | "~"
}

export function Sidebar({ backHref, className, ...props }: Props) {
	const pathname = usePathname()
	const [href, setHref] = useState<string | undefined>(backHref)

	useEffect(() => {
		if (backHref === "~") setHref(typeof window !== "undefined" ? window.location.origin.replace(/\/[^/]*$/, "") : "/")
	}, [backHref])

	return (
		<div className={cn("border-r", className)} {...props}>
			<div className="sticky top-0 space-y-4 p-4">
				<div className="flex items-center gap-2">
					{href && (
						<Link href={href} className={buttonVariants({ variant: "transparent", className: "-ml-3" })}>
							<ChevronLeftIcon />
							Back
						</Link>
					)}

					<h2 className="text-foreground font-mono text-lg font-medium">Components</h2>
				</div>

				<ul className="space-y-1">
					<li>
						<Link
							href="/"
							className={cn(
								"text-sm transition-colors",
								"block rounded-md px-3 py-2",
								pathname === "/"
									? "bg-accent text-accent-foreground font-medium"
									: "text-muted-foreground hover:text-foreground hover:bg-accent/50"
							)}
						>
							Home
						</Link>
					</li>
					{components.map((component, index) => {
						const slug = toKebabCase(component.title)
						const isActive = pathname === `/${slug}`

						return (
							<li key={index}>
								<Link
									href={`/${slug}`}
									className={cn(
										"text-sm transition-colors",
										"block rounded-md px-3 py-2",
										isActive
											? "bg-accent text-accent-foreground font-medium"
											: "text-muted-foreground hover:text-foreground hover:bg-accent/50"
									)}
								>
									{component.title}
								</Link>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
