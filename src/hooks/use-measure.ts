import { useCallback, useEffect, useState } from "react"

interface Bounds {
	width: number
	height: number
}

type UseMeasureReturn<T extends HTMLElement> = [(node: T | null) => void, Bounds]

export function useMeasure<T extends HTMLElement = HTMLElement>(): UseMeasureReturn<T> {
	const [element, setElement] = useState<T | null>(null)
	const [bounds, setBounds] = useState<Bounds>({ width: 0, height: 0 })

	const ref = useCallback((node: T | null) => {
		setElement(node)
	}, [])

	useEffect(() => {
		if (!element) return

		const observer = new ResizeObserver(([entry]) => {
			setBounds({
				width: entry.contentRect.width,
				height: entry.contentRect.height,
			})
		})

		observer.observe(element)
		return () => observer.disconnect()
	}, [element])

	return [ref, bounds]
}
