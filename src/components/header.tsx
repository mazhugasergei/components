import { Logo } from "@/components/logo"
import React from "react"

export interface Props extends React.ComponentProps<"header"> {}

export function Header(props: Props) {
	return (
		<header {...props}>
			<div className="mx-auto flex max-w-3xl items-center justify-between px-8 py-6 xl:max-w-4xl">
				<Logo />
				<div className="flex items-center gap-8">
					<a
						href="https://github.com/mazhugasergei/components"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
					>
						GitHub
					</a>
				</div>
			</div>
		</header>
	)
}
