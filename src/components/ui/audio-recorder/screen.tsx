"use client"

import { ComponentProps, useCallback, useEffect, useRef } from "react"

// bar geometry, in CSS px before devicePixelRatio scaling
const BAR_WIDTH = 3
const BAR_GAP = 2

const SAMPLE_INTERVAL_MS = 60

// where the red line stops, as a fraction of canvas width
// (0.5 = middle, 0.75 = closer to the right edge, etc) — used only to pick
// how many bars fit; the actual resting pixel position is snapped to the
// bar/gap grid so the line always lands exactly after the last bar + gap
const LINE_STOP_PERCENT = 0.9
const LINE_WIDTH = 2

export interface ScreenProps extends ComponentProps<"div"> {
	analyser: AnalyserNode | null
	isRecording: boolean
	status?: string | null
}

export function Screen({ analyser, isRecording, status, className, ...props }: ScreenProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
	const animFrameRef = useRef(0)
	// rolling history of volume samples (0-1), oldest first
	const historyRef = useRef<number[]>([])
	const lastSampleRef = useRef(0)

	// flat row of minimal "no signal" stub bars — used as the idle screen,
	// and as a permanent backdrop behind the live meter so empty slots
	// (not yet reached, or already scrolled past) still show as placeholders
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

		// pick how many bars fit before the target percent, then snap the
		// line's resting x to that bar count's slot boundary — i.e. exactly
		// after the last bar + its gap, rather than an arbitrary raw pixel cut
		const maxVisibleBars = Math.max(1, Math.floor((w * LINE_STOP_PERCENT) / slot))
		const targetX = maxVisibleBars * slot

		// only commit a new bar every SAMPLE_INTERVAL_MS, regardless of frame rate.
		// bars accumulate left-to-right and are NOT shifted out until the array is
		// full up to the line's target — so nothing scrolls past the left edge
		// until the line itself has reached its resting position.
		const now = Date.now()
		if (now - lastSampleRef.current >= SAMPLE_INTERVAL_MS) {
			lastSampleRef.current = now
			const history = historyRef.current
			history.push(level)
			if (history.length > maxVisibleBars) history.shift()
		}

		const ctx = canvas.getContext("2d")
		if (!ctx) return
		ctx.clearRect(0, 0, w, h)

		// placeholder dots stay underneath the live meter the whole time —
		// real bars simply draw over them where volume data exists
		drawBaseline(ctx, w, h)

		const history = historyRef.current
		history.forEach((lvl, i) => {
			const barHeight = Math.max(2 * dpr, lvl * h * 0.9)
			const x = i * slot
			ctx.fillStyle = "#fff"
			ctx.fillRect(x, (h - barHeight) / 2, BAR_WIDTH * dpr, barHeight)
		})

		// red line: tracks the writing edge while filling, freezes at the
		// target position once the bars have caught up to it
		const lineX = history.length >= maxVisibleBars ? targetX : history.length * slot
		ctx.fillStyle = "#f87171"
		ctx.fillRect(lineX, 0, LINE_WIDTH * dpr, h)
	}, [analyser, drawBaseline])

	// idle baseline on mount + resize
	useEffect(() => {
		drawIdle()
		window.addEventListener("resize", drawIdle)
		return () => window.removeEventListener("resize", drawIdle)
	}, [drawIdle])

	// start/stop the live meter loop whenever recording starts/stops
	// or the analyser instance changes
	useEffect(() => {
		if (isRecording && analyser) {
			// ArrayBuffer constructor ensures correct type
			dataArrayRef.current = new Uint8Array(new ArrayBuffer(analyser.fftSize))
			historyRef.current = []
			lastSampleRef.current = 0
			drawBars()
		} else {
			cancelAnimationFrame(animFrameRef.current)
			drawIdle()
		}

		return () => cancelAnimationFrame(animFrameRef.current)
	}, [isRecording, analyser, drawBars, drawIdle])

	return (
		<div
			className={`relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 ${className || ""}`}
			{...props}
		>
			<canvas ref={canvasRef} className="block h-20 w-full" />
			{status && <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-neutral-500">{status}</p>}
		</div>
	)
}
