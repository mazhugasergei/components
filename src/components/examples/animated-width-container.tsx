"use client"

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
		<div className="flex items-center justify-center py-8">
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
		</div>
	)
}
