"use client"

import { useEffect, useRef, useState } from "react"

const ASPECT_RATIO = 10 / 1
const DOT_SIZE = 3
const DOT_GAP = 5

export function DecorativeSpeakers() {
	const containerRef = useRef<HTMLDivElement>(null)
	const [grid, setGrid] = useState({ cols: 0, rows: 0 })

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const updateGrid = () => {
			const { width, height } = container.getBoundingClientRect()
			const cell = DOT_SIZE + DOT_GAP
			const cols = Math.max(0, Math.floor((width + DOT_GAP) / cell))
			const rows = Math.max(0, Math.floor((height + DOT_GAP) / cell))
			setGrid({ cols, rows })
		}

		updateGrid()
		const observer = new ResizeObserver(updateGrid)
		observer.observe(container)
		return () => observer.disconnect()
	}, [])

	const dots = Array.from({ length: grid.cols * grid.rows })

	return (
		<div ref={containerRef} className="relative w-full" style={{ aspectRatio: `${ASPECT_RATIO}` }}>
			<div
				className="absolute inset-0 grid place-content-center"
				style={{
					gridTemplateColumns: `repeat(${grid.cols}, ${DOT_SIZE}px)`,
					gridTemplateRows: `repeat(${grid.rows}, ${DOT_SIZE}px)`,
					gap: `${DOT_GAP}px`,
				}}
			>
				{dots.map((_, i) => (
					<span key={i} className="rounded-full bg-black" style={{ width: DOT_SIZE, height: DOT_SIZE }} />
				))}
			</div>
		</div>
	)
}
