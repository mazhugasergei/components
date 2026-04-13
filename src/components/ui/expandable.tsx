"use client"

import { useMeasure } from "@/hooks/use-measure"
import { cn } from "@/utils/classname"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import React, { cloneElement, useState } from "react"

interface ExpandableProps extends React.ComponentProps<"div"> {
	expandedContent: React.ReactNode
	expandTrigger?: [React.ReactNode, React.ReactNode]
	onExpandedChange?: (expanded: boolean) => void
}

export function Expandable({
	children,
	expandedContent,
	onExpandedChange,
	expandTrigger,
	className,
	...props
}: ExpandableProps) {
	const [ref, bounds] = useMeasure()
	const [expanded, setExpanded] = useState(false)

	const handleToggle = () => {
		const newExpanded = !expanded
		setExpanded(newExpanded)
		onExpandedChange?.(newExpanded)
	}
	return (
		<MotionConfig
			transition={{
				duration: 0.4,
				ease: [0.19, 1, 0.22, 1],
				delay: 0.05,
			}}
		>
			<div
				className={cn("bg-background flex w-full max-w-md flex-col gap-3 rounded-xl border p-5", className)}
				{...props}
			>
				<motion.div
					animate={{
						height: bounds.height > 0 ? bounds.height : "auto",
					}}
					className="overflow-hidden"
				>
					<div ref={ref} className="flex flex-col gap-3">
						{children}
						<AnimatePresence mode="popLayout">{expanded && expandedContent}</AnimatePresence>
					</div>
				</motion.div>
				{expandTrigger ? (
					cloneElement(expandTrigger[expanded ? 1 : 0] as React.ReactElement<React.ComponentProps<"button">>, {
						onClick: handleToggle,
					})
				) : (
					<button
						type="button"
						onClick={handleToggle}
						className="bg-primary text-primary-foreground flex cursor-pointer items-center justify-center rounded-lg border px-4 py-1.5 text-sm font-medium whitespace-nowrap active:scale-95"
					>
						{expanded ? "See less" : "See more"}
					</button>
				)}
			</div>
		</MotionConfig>
	)
}
