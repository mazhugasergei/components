"use client"

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
}
