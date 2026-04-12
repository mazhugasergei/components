"use client"

import { AnimatedButton } from "@/components/ui/animated-button"
import { useState } from "react"

const labels = ["Lorem Ipsum", "Ex Amet", "Aliqua Velit"]

export function AnimatedWidthContainerExample() {
	const [widthIndex, setWidthIndex] = useState(0)

	return (
		<div className="flex items-center justify-center py-8">
			<AnimatedButton onClick={() => setWidthIndex((prev) => (prev + 1) % labels.length)}>
				{labels[widthIndex]}
			</AnimatedButton>
		</div>
	)
}
