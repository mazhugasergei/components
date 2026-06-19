"use client"

import { ComponentProps, useCallback, useEffect, useRef } from "react"

const BAR_COUNT = 32 // fixed number of bars
const BAR_GAP = 3 // px gap between bars
const SMOOTHING = 0.18 // 0 = instant, 1 = never moves
const PEAK_HOLD_MS = 1200 // how long peak dots linger
const PEAK_FALL_RATE = 0.012 // how fast peak dot falls per frame

export interface VolumeScreenProps extends ComponentProps<"div"> {
	analyser: AnalyserNode | null
	isActive: boolean
}

export function Screen({ analyser, isActive, className, ...props }: VolumeScreenProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
	const animFrameRef = useRef(0)
	// smoothed height per bar (0–1)
	const levelsRef = useRef<number[]>(Array(BAR_COUNT).fill(0))
	// peak dot per bar: { level: 0–1, heldUntil: timestamp }
	const peaksRef = useRef<{ level: number; heldUntil: number }[]>(
		Array.from({ length: BAR_COUNT }, () => ({ level: 0, heldUntil: 0 }))
	)

	const draw = useCallback(() => {
		const canvas = canvasRef.current
		const dataArray = dataArrayRef.current
		if (!analyser || !dataArray || !canvas) return

		animFrameRef.current = requestAnimationFrame(draw)
		analyser.getByteFrequencyData(dataArray)

		const dpr = window.devicePixelRatio
		const { width: w, height: h } = canvas
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		// map frequency bins → BAR_COUNT bands
		const binCount = dataArray.length
		const now = Date.now()

		ctx.clearRect(0, 0, w, h)

		const totalGap = BAR_GAP * dpr * (BAR_COUNT - 1)
		const barW = (w - totalGap) / BAR_COUNT

		for (let i = 0; i < BAR_COUNT; i++) {
			// logarithmic-ish frequency mapping: low freqs get more bars
			const startBin = Math.floor(Math.pow(i / BAR_COUNT, 1.6) * binCount)
			const endBin = Math.floor(Math.pow((i + 1) / BAR_COUNT, 1.6) * binCount)
			let sum = 0
			const count = Math.max(1, endBin - startBin)
			for (let b = startBin; b < endBin; b++) sum += dataArray[b] ?? 0
			const raw = Math.min(1, sum / count / 255)

			// smooth
			const prev = levelsRef.current[i] ?? 0
			const level = prev + (raw - prev) * (1 - SMOOTHING)
			levelsRef.current[i] = level

			// peak
			const peak = peaksRef.current[i]!
			if (level >= peak.level) {
				peak.level = level
				peak.heldUntil = now + PEAK_HOLD_MS
			} else if (now > peak.heldUntil) {
				peak.level = Math.max(0, peak.level - PEAK_FALL_RATE)
			}

			const x = i * (barW + BAR_GAP * dpr)
			const barH = Math.max(2 * dpr, level * h)

			// bar — bottom-anchored
			ctx.fillStyle = "#fff"
			ctx.fillRect(x, h - barH, barW, barH)

			// peak dot
			if (peak.level > 0.02) {
				const peakY = h - peak.level * h
				const dotH = 2 * dpr
				ctx.fillStyle = "#f87171"
				ctx.fillRect(x, peakY, barW, dotH)
			}
		}
	}, [analyser])

	const drawIdle = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		canvas.width = canvas.offsetWidth * window.devicePixelRatio
		canvas.height = canvas.offsetHeight * window.devicePixelRatio
		const ctx = canvas.getContext("2d")
		if (!ctx) return
		const { width: w, height: h } = canvas
		ctx.clearRect(0, 0, w, h)

		const dpr = window.devicePixelRatio
		const totalGap = BAR_GAP * dpr * (BAR_COUNT - 1)
		const barW = (w - totalGap) / BAR_COUNT
		const stubH = 2 * dpr

		ctx.fillStyle = "rgba(148,163,184,0.25)"
		for (let i = 0; i < BAR_COUNT; i++) {
			const x = i * (barW + BAR_GAP * dpr)
			ctx.fillRect(x, (h - stubH) / 2, barW, stubH)
		}
	}, [])

	useEffect(() => {
		drawIdle()
		const onResize = () => drawIdle()
		window.addEventListener("resize", onResize)
		return () => window.removeEventListener("resize", onResize)
	}, [drawIdle])

	useEffect(() => {
		if (isActive && analyser) {
			const canvas = canvasRef.current
			if (canvas) {
				canvas.width = canvas.offsetWidth * window.devicePixelRatio
				canvas.height = canvas.offsetHeight * window.devicePixelRatio
			}
			dataArrayRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
			levelsRef.current = Array(BAR_COUNT).fill(0)
			peaksRef.current = Array.from({ length: BAR_COUNT }, () => ({ level: 0, heldUntil: 0 }))
			draw()
		} else {
			cancelAnimationFrame(animFrameRef.current)
			drawIdle()
		}
		return () => cancelAnimationFrame(animFrameRef.current)
	}, [isActive, analyser, draw, drawIdle])

	return (
		<div className={`overflow-hidden ${className || ""}`} {...props}>
			<canvas ref={canvasRef} className="block h-20 w-full" />
		</div>
	)
}
