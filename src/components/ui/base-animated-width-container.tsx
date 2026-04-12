"use client"

import { useMeasure } from "@/hooks/use-measure"
import { motion } from "motion/react"

interface Props extends React.ComponentPropsWithoutRef<typeof motion.button> {
	children: React.ReactNode
}

export function BaseAnimatedWidthContainer({ children, ...props }: Props) {
	const [ref, bounds] = useMeasure()

	return (
		<motion.button animate={{ width: bounds.width > 0 ? bounds.width : "auto" }} {...props}>
			<div ref={ref}>{children}</div>
		</motion.button>
	)
}
