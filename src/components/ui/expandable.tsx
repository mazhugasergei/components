"use client"

import React from "react"

interface Props extends React.ComponentProps<"div"> {
	expandedContent: React.ReactNode
	expandTrigger?: [React.ReactNode, React.ReactNode]
	onExpandedChange?: (expanded: boolean) => void
}

export function Expandable({ children, expandedContent, onExpandedChange, expandTrigger, className, ...props }: Props) {
	const [expanded, setExpanded] = React.useState(false)

	const handleToggle = () => {
		const next = !expanded
		setExpanded(next)
		onExpandedChange?.(next)
	}

	return (
		<div className={`bg-background flex w-full max-w-md flex-col rounded-xl border p-5 ${className ?? ""}`} {...props}>
			{children}
			<div
				className="grid overflow-hidden transition-[grid-template-rows,opacity,filter] duration-300 ease-out"
				style={{
					gridTemplateRows: expanded ? "1fr" : "0fr",
					opacity: expanded ? 1 : 0,
					filter: expanded ? "blur(0px)" : "blur(6px)",
				}}
			>
				<div className="min-h-0">{expandedContent}</div>
			</div>

			{expandTrigger ? (
				React.cloneElement(expandTrigger[expanded ? 1 : 0] as React.ReactElement<React.ComponentProps<"button">>, {
					onClick: handleToggle,
				})
			) : (
				<button
					type="button"
					onClick={handleToggle}
					className="bg-primary text-primary-foreground mt-3 flex cursor-pointer items-center justify-center rounded-lg border px-4 py-1.5 text-sm font-medium whitespace-nowrap active:scale-95"
				>
					{expanded ? "See less" : "See more"}
				</button>
			)}
		</div>
	)
}
