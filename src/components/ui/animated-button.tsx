"use client"

import { cn } from "@/utils/classname"
import { MotionConfig, type MotionProps, motion } from "motion/react"
import { BaseAnimatedButton } from "./base-animated-button"

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

export function AnimatedButton({ children, className, ...props }: React.ComponentProps<typeof BaseAnimatedButton>) {
	return (
		<MotionConfig
			transition={{
				duration: 0.4,
				ease: [0.19, 1, 0.22, 1],
				delay: 0.05,
			}}
		>
			<BaseAnimatedButton
				className={cn("bg-primary cursor-pointer rounded-lg border px-4 py-1 active:scale-95", className)}
				{...props}
			>
				<motion.span
					{...animation}
					key={children?.toString()}
					className="text-primary-foreground px-4 py-2 text-sm font-medium whitespace-nowrap"
				>
					{children}
				</motion.span>
			</BaseAnimatedButton>
		</MotionConfig>
	)
}
