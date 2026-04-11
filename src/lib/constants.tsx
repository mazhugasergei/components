import { AnimatedHeightContainerExample } from "@/components/examples/animated-height-container"
import { AnimatedWidthContainerExample } from "@/components/examples/animated-width-container"

export const components = [
	{
		title: "<AnimatedWidthContainer/>",
		description: "Smooth width transitions when button content changes using custom useMeasure hook",
		badgeColor: "blue" as const,
		codeBlocks: [
			{
				title: "Installation",
				code: "npm install motion/react",
			},
			{
				title: "Component",
				code: `"use client"

import { useMeasure } from "@/hooks/use-measure"
import { cn } from "@/utils/classname"
import { MotionConfig, type MotionProps, motion } from "motion/react"

const animation: MotionProps = {
	initial: { opacity: 0, filter: "blur(8px)", scale: 0.95 },
	animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
	exit: { opacity: 0, filter: "blur(8px)", scale: 0.95 },
	transition: {
		duration: 0.4,
		ease: [0.19, 1, 0.22, 1],
		delay: 0.05,
		opacity: {
			duration: 0.6,
			ease: "easeInOut",
		},
	},
}

interface AnimatedWidthContainerProps {
	children: React.ReactNode
	onClick?: () => void
	className?: string
}

export function AnimatedWidthContainer({ children, onClick, className }: AnimatedWidthContainerProps) {
	const [ref, bounds] = useMeasure()

	return (
		<MotionConfig
			transition={{
				duration: 0.4,
				ease: [0.19, 1, 0.22, 1],
				delay: 0.05,
			}}
		>
			<motion.button
				animate={{
					width: bounds.width > 0 ? bounds.width : "auto",
				}}
				onClick={onClick}
				className={cn(
					"bg-primary border-border flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border outline-none active:scale-95",
					className
				)}
			>
				<div ref={ref} className="flex items-center justify-center whitespace-nowrap">
					<motion.span
						{...animation}
						key={children?.toString()}
						className="text-primary-foreground px-4 py-2 text-sm font-medium whitespace-nowrap"
					>
						{children}
					</motion.span>
				</div>
			</motion.button>
		</MotionConfig>
	)
}`,
				filePath: "src/components/ui/animated-width-container.tsx",
			},
			{
				title: "Usage",
				code: `"use client"

import { AnimatedWidthContainer } from "@/components/ui/animated-width-container"
import { useState } from "react"

// Example data
const labels = ["Lorem Ipsum", "Ex Amet", "Aliqua Velit"]

export function AnimatedWidthContainerExample() {
  const [widthIndex, setWidthIndex] = useState(0)

  return (
    <div className="flex items-center justify-center py-8">
      <AnimatedWidthContainer onClick={() => setWidthIndex((prev) => (prev + 1) % labels.length)}>
        {labels[widthIndex]}
      </AnimatedWidthContainer>
    </div>
  )
}`,
				filePath: "src/app/page.tsx",
			},
		],
		example: <AnimatedWidthContainerExample />,
	},
	{
		title: "<AnimatedHeightContainer/>",
		description: "Smooth height animations for expandable content using AnimatePresence and ResizeObserver",
		badgeColor: "green" as const,
		codeBlocks: [
			{
				title: "Installation",
				code: "npm install motion/react",
			},
			{
				title: "Component",
				code: `"use client"

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
	buttonText?: {
		collapsed: string
		expanded: string
	}
	onToggle?: (expanded: boolean) => void
	className?: string
	expandTrigger?: React.ReactNode
}

export function AnimatedHeightContainer({
	children,
	expandedContent,
	buttonText = { collapsed: "Read More", expanded: "Show Less" },
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
								{expanded ? buttonText.expanded : buttonText.collapsed}
							</button>
						)}
					</>
				)}
			</div>
		</MotionConfig>
	)
}`,
				filePath: "src/components/ui/animated-height-container.tsx",
			},
			{
				title: "Usage",
				code: `"use client"

import { AnimatedHeightContainer } from "@/components/ui/animated-height-container"
import { Paragraph } from "@/components/ui/paragraph"
import { motion } from "motion/react"

export function AnimatedHeightContainerExample() {
	const expandedContent = (
		<motion.div
			initial={{ opacity: 0, filter: "blur(8px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			exit={{ opacity: 0, filter: "blur(8px)" }}
		>
			<Paragraph>
				This technique uses a ref to track the height of the inner content. When the content changes, the measured
				height updates and Motion animates the outer container to match. The inner div always has its natural height, so
				the content is never clipped or distorted.
			</Paragraph>
		</motion.div>
	)

	return (
		<div className="flex items-center justify-center p-8">
			<AnimatedHeightContainer
				expandedContent={expandedContent}
				buttonText={{ collapsed: "Read More", expanded: "Show Less" }}
			>
				<Paragraph>
					Containers on the web snap to their new size instantly when content changes. By measuring the bounds of a
					container and animating to those values, we can make these transitions feel smooth and intentional.
				</Paragraph>
			</AnimatedHeightContainer>
		</div>
	)
}`,
				filePath: "src/app/page.tsx",
			},
		],
		example: <AnimatedHeightContainerExample />,
	},
]
