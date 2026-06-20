"use client"

import { Button } from "@/components/ui/button"
import { useMeasure } from "@/hooks/use-measure"
import { ComponentProps, useEffect, useRef, useState } from "react"

const EASING = "cubic-bezier(0.19,1,0.22,1)"

const transitionIn = [
	`opacity 500ms ease-in-out 50ms`,
	`filter 400ms ${EASING} 50ms`,
	`scale 400ms ${EASING} 50ms`,
].join(", ")

export function AnimatedButton({ children, className, ...props }: ComponentProps<"button">) {
	const [ref, bounds] = useMeasure()
	const [width, setWidth] = useState("auto")
	const [displayedChildren, setDisplayedChildren] = useState(children)
	const [visible, setVisible] = useState(true)
	const isFirstRender = useRef(true)

	useEffect(() => {
		if (bounds.width > 0) setWidth(`${bounds.width}px`)
	}, [bounds.width])

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false
			return
		}

		setDisplayedChildren(children)
		setVisible(false)

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setVisible(true)
			})
		})
	}, [children])

	return (
		<Button
			style={{ width }}
			className={`cursor-pointer font-sans normal-case transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] active:scale-95 ${className ?? ""}`}
			{...props}
		>
			<div ref={ref}>
				<span
					style={{
						display: "inline-block",
						opacity: visible ? 1 : 0,
						filter: visible ? "blur(0px)" : "blur(8px)",
						scale: visible ? 1 : 0.95,
						transition: visible ? transitionIn : "none",
					}}
					className="text-primary-foreground px-4 text-sm font-medium whitespace-nowrap"
				>
					{displayedChildren}
				</span>
			</div>
		</Button>
	)
}
