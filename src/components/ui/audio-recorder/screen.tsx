"use client"

import { ComponentProps, useCallback, useEffect, useRef } from "react"

const BAR_WIDTH = 3
const BAR_GAP = 2
const SAMPLE_INTERVAL = 60 // ms
const LINE_STOP = 0.9
const LINE_START = 0.0
const LINE_WIDTH = 2

export interface ScreenProps extends ComponentProps<"div"> {
	analyser: AnalyserNode | null
	isActive: boolean
}

export function Screen({ analyser, isActive, className, ...props }: ScreenProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
	const animFrameRef = useRef(0)
	const historyRef = useRef<number[]>([])
	const lastSampleRef = useRef(0)

	const drawBaseline = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
		const dpr = window.devicePixelRatio
		const slot = (BAR_WIDTH + BAR_GAP) * dpr
		const barHeight = 2 * dpr
		const count = Math.ceil(w / slot)

		ctx.fillStyle = "rgba(148,163,184,0.25)"
		for (let i = 0; i < count; i++) {
			ctx.fillRect(i * slot, (h - barHeight) / 2, BAR_WIDTH * dpr, barHeight)
		}
	}, [])

	const drawIdle = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		canvas.width = canvas.offsetWidth * window.devicePixelRatio
		canvas.height = canvas.offsetHeight * window.devicePixelRatio
		const ctx = canvas.getContext("2d")
		if (!ctx) return
		const { width: w, height: h } = canvas
		ctx.clearRect(0, 0, w, h)
		drawBaseline(ctx, w, h)
	}, [drawBaseline])

	const drawBars = useCallback(() => {
		const canvas = canvasRef.current
		const dataArray = dataArrayRef.current
		if (!analyser || !dataArray || !canvas) return

		animFrameRef.current = requestAnimationFrame(drawBars)

		analyser.getByteTimeDomainData(dataArray)

		let sumSquares = 0
		for (let i = 0; i < dataArray.length; i++) {
			const v = ((dataArray[i] ?? 128) - 128) / 128
			sumSquares += v * v
		}
		const rms = Math.sqrt(sumSquares / dataArray.length)
		const level = Math.min(1, rms * 4)

		const dpr = window.devicePixelRatio
		const slot = (BAR_WIDTH + BAR_GAP) * dpr
		const { width: w, height: h } = canvas

		const maxVisibleBars = Math.max(1, Math.ceil((w * LINE_STOP) / slot))
		const targetX = maxVisibleBars * slot

		const now = Date.now()
		if (now - lastSampleRef.current >= SAMPLE_INTERVAL) {
			lastSampleRef.current = now
			const history = historyRef.current
			history.push(level)
			if (history.length > maxVisibleBars) history.shift()
		}

		const ctx = canvas.getContext("2d")
		if (!ctx) return
		ctx.clearRect(0, 0, w, h)

		drawBaseline(ctx, w, h)

		const history = historyRef.current
		history.forEach((lvl, i) => {
			const barHeight = Math.max(2 * dpr, lvl * h * 0.9)
			const x = i * slot
			ctx.fillStyle = "#fff"
			ctx.fillRect(x, (h - barHeight) / 2, BAR_WIDTH * dpr, barHeight)
		})

		// red line travels from LINE_START_PERCENT → LINE_STOP_PERCENT as bars fill
		const startX = w * LINE_START
		const lineX =
			history.length >= maxVisibleBars ? targetX : startX + (history.length / maxVisibleBars) * (targetX - startX)
		ctx.fillStyle = "#f87171"
		ctx.fillRect(lineX, 0, LINE_WIDTH * dpr, h)
	}, [analyser, drawBaseline])

	useEffect(() => {
		drawIdle()
		window.addEventListener("resize", drawIdle)
		return () => window.removeEventListener("resize", drawIdle)
	}, [drawIdle])

	useEffect(() => {
		if (isActive && analyser) {
			dataArrayRef.current = new Uint8Array(new ArrayBuffer(analyser.fftSize))
			historyRef.current = []
			lastSampleRef.current = 0
			drawBars()
		} else {
			cancelAnimationFrame(animFrameRef.current)
			drawIdle()
		}

		return () => cancelAnimationFrame(animFrameRef.current)
	}, [isActive, analyser, drawBars, drawIdle])

	return (
		<div className={`overflow-hidden ${className || ""}`} {...props}>
			<canvas ref={canvasRef} className="block h-20 w-full" />
		</div>
	)
}
