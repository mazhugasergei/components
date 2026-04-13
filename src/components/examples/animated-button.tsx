"use client"

import { AnimatedButton } from "@/components/ui/animated-button"
import { useState } from "react"

const labels = ["Click me", "I'm clicked!", "Clicked again!"]

export function AnimatedButtonExample() {
	const [index, setIndex] = useState(0)

	return (
		<div className="flex items-center justify-center py-8">
			<AnimatedButton onClick={() => setIndex((prev) => (prev + 1) % labels.length)}>{labels[index]}</AnimatedButton>
		</div>
	)
}
