"use client"

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
			<AnimatedHeightContainer expandedContent={expandedContent}>
				<Paragraph>
					Containers on the web snap to their new size instantly when content changes. By measuring the bounds of a
					container and animating to those values, we can make these transitions feel smooth and intentional.
				</Paragraph>
			</AnimatedHeightContainer>
		</div>
	)
}
