"use client"

import { Expandable } from "@/components/ui/expandable"
import { motion } from "motion/react"

export function ExpandableExample() {
	const expandedContent = (
		<motion.div
			initial={{ opacity: 0, filter: "blur(8px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			exit={{ opacity: 0, filter: "blur(8px)" }}
		>
			<p className="text-sm leading-relaxed">
				This technique uses a ref to track the height of the inner content. When the content changes, the measured
				height updates and Motion animates the outer container to match. The inner div always has its natural height, so
				the content is never clipped or distorted.
			</p>
		</motion.div>
	)

	return (
		<Expandable expandedContent={expandedContent}>
			<p className="text-sm leading-relaxed">
				Containers on the web snap to their new size instantly when content changes. By measuring the bounds of a
				container and animating to those values, we can make these transitions feel smooth and intentional.
			</p>
		</Expandable>
	)
}
