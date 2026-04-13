"use client"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { cn } from "@/utils/classname"
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { ComponentProps, useEffect, useState } from "react"
import { buttonVariants } from "./button"

interface LayoutHeaderProps extends ComponentProps<"header"> {
	title?: string
	showBackButton?: boolean
	backHref?: string
}

export function Header({ title, showBackButton = false, backHref = "/", className, ...props }: LayoutHeaderProps) {
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY)

		handleScroll()
		window.addEventListener("scroll", handleScroll)

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<header
			className={cn("bg-background/80 backdrop-blur-safe sticky top-0 z-50", scrollY > 10 && "border-b", className)}
			{...props}
		>
			<div className="mx-auto flex max-w-2xl items-center justify-between py-2">
				<div className="flex items-center gap-4">
					{showBackButton && (
						<Link href={backHref} className={buttonVariants({ variant: "transparent" })}>
							<ChevronLeftIcon />
							Back
						</Link>
					)}
					{title && (
						<span className={cn("truncate text-lg font-bold opacity-0 transition", scrollY > 40 && "opacity-100")}>
							{title}
						</span>
					)}
				</div>

				<ThemeSwitcher className="mr-4" />
			</div>
		</header>
	)
}
