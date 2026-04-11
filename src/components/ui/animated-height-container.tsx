"use client"

import { cn } from "@/utils/classname"
import { AnimatePresence, MotionConfig, motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

function useMeasure<T extends HTMLElement = HTMLElement>(): [
	(node: T | null) => void,
	{ width: number; height: number },
] {
	const [element, setElement] = useState<T | null>(null)
	const [bounds, setBounds] = useState({ width: 0, height: 0 })

	const ref = useCallback((node: T | null) => {
		setElement(node)
	}, [])

	useEffect(() => {
		if (!element) return

		const observer = new ResizeObserver(([entry]) => {
			setBounds({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			})
		})

		observer.observe(element)
		return () => observer.disconnect()
	}, [element])

	return [ref, bounds]
}

interface AnimatedHeightContainerProps {
	children: React.ReactNode
	expandedContent?: React.ReactNode
	onToggle?: (expanded: boolean) => void
	className?: string
	expandTrigger?: React.ReactNode
}

export function AnimatedHeightContainer({
	children,
	expandedContent,
	onToggle,
	className,
	expandTrigger,
}: AnimatedHeightContainerProps) {
	const [expanded, setExpanded] = useState(false)
	const [ref, bounds] = useMeasure()

	const handleToggle = () => {
		const newExpanded = !expanded
		setExpanded(newExpanded)
		onToggle?.(newExpanded)
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
				className={cn(
					"border-border bg-background flex w-full max-w-md flex-col gap-3 rounded-xl border p-5",
					className
				)}
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
				{expandedContent && (
					<>
						{expandTrigger ? (
							<div onClick={handleToggle}>{expandTrigger}</div>
						) : (
							<button
								type="button"
								className="bg-muted text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 cursor-pointer items-center justify-center rounded-lg border-none px-3 text-sm font-medium outline-none active:scale-95"
								onClick={handleToggle}
							>
								{expanded ? "See less" : "See more"}
							</button>
						)}
					</>
				)}
			</div>
		</MotionConfig>
	)
}
