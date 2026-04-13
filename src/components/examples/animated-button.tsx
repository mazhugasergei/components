"use client"

import { AnimatedButton } from "@/components/ui/animated-button"
import { useState } from "react"

const LABELS = ["Click me", "I'm clicked!", "Clicked again!"]

export function AnimatedButtonExample() {
	const [index, setIndex] = useState(0)

	return <AnimatedButton onClick={() => setIndex((prev) => (prev + 1) % LABELS.length)}>{LABELS[index]}</AnimatedButton>
}
