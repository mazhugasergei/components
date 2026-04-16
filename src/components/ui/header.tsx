"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/utils/classname"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { ComponentProps, useEffect, useState } from "react"

interface Props extends ComponentProps<"header"> {
	title?: string
	backHref?: string | "~"
}

export function Header({ title, backHref, className, ...props }: Props) {
	const [href, setHref] = useState<string | undefined>(backHref)

	useEffect(() => {
		if (backHref === "~") setHref(typeof window !== "undefined" ? window.location.origin.replace(/\/[^/]*$/, "") : "/")
	}, [backHref])

	return (
		<header className={cn("bg-background/80 backdrop-blur-safe sticky top-0 z-50 border-b", className)} {...props}>
			<div className="flex items-center justify-between py-2">
				<div className="flex items-center gap-4">
					{href && (
						<Link href={href} className={buttonVariants({ variant: "transparent" })}>
							<ChevronLeftIcon />
							Back
						</Link>
					)}
					{title && <span className="truncate text-lg font-bold">{title}</span>}
				</div>
			</div>
		</header>
	)
}
