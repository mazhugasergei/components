"use client"

import { cn } from "@/utils/classname"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { buttonVariants } from "./ui/button"

interface Props extends React.ComponentProps<typeof Link> {
	href: string | "~"
}

export function BackButton({ href, className, ...props }: Props) {
	const [resolvedHref, setResolvedHref] = useState(href)

	useEffect(() => {
		if (href === "~")
			setResolvedHref(typeof window !== "undefined" ? window.location.origin.replace(/\/[^/]*$/, "") : "/")
	}, [href])

	return (
		<Link
			href={resolvedHref}
			className={buttonVariants({ variant: "transparent", className: cn("gap-1.5! font-mono", className) })}
			{...props}
		>
			<ChevronLeftIcon />
			Back
		</Link>
	)
}
