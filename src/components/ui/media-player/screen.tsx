"use client"

import { ComponentProps, useCallback, useEffect, useRef } from "react"

const BAR_WIDTH = 3
const BAR_GAP = 3
const SMOOTHING = 0.18
const STOP_SMOOTHING = 0.08
const PEAK_HOLD_MS = 100
const PEAK_FALL_RATE = 0.012

type BarOrigin = "bottom" | "center"

export interface VolumeScreenProps extends ComponentProps<"div"> {
	analyser: AnalyserNode | null
	isActive: boolean
	barOrigin?: BarOrigin
}

export function Screen({ analyser, isActive, barOrigin = "bottom", className, ...props }: VolumeScreenProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
	const animFrameRef = useRef(0)
	const levelsRef = useRef<number[]>([])
	const peaksRef = useRef<{ level: number; heldUntil: number }[]>([])
	const barOriginRef = useRef<BarOrigin>(barOrigin)
	const isActiveRef = useRef(isActive)

	useEffect(() => {
		barOriginRef.current = barOrigin
	}, [barOrigin])
	useEffect(() => {
		isActiveRef.current = isActive
	}, [isActive])

	const getBarCount = useCallback((w: number, dpr: number) => {
		const slot = (BAR_WIDTH + BAR_GAP) * dpr
		return Math.ceil(w / slot)
	}, [])

	const drawFrame = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext("2d")
		if (!ctx) return

		const dpr = window.devicePixelRatio
		const { width: w, height: h } = canvas
		const barCount = getBarCount(w, dpr)
		const slot = (BAR_WIDTH + BAR_GAP) * dpr
		const barW = BAR_WIDTH * dpr
		const centered = barOriginRef.current === "center"
		const half = Math.ceil(barCount / 2)

		ctx.clearRect(0, 0, w, h)

		for (let i = 0; i < barCount; i++) {
			// outer edges = loudest (high binIndex), center = quietest (binIndex 0)
			const binIndex = i < half ? half - 1 - i : i - half

			const level = levelsRef.current[binIndex] ?? 0
			const peak = peaksRef.current[binIndex] ?? { level: 0, heldUntil: 0 }

			const x = i * slot
			const barH = Math.max(2 * dpr, level * h)

			ctx.fillStyle = "#fff"
			if (centered) {
				ctx.fillRect(x, (h - barH) / 2, barW, barH)
			} else {
				ctx.fillRect(x, h - barH, barW, barH)
			}

			if (peak.level > 0.02) {
				ctx.fillStyle = "#f87171"
				if (centered) {
					const peakHalf = (peak.level * h) / 2
					const centerY = h / 2
					ctx.fillRect(x, centerY - peakHalf, barW, 2 * dpr)
					ctx.fillRect(x, centerY + peakHalf - 2 * dpr, barW, 2 * dpr)
				} else {
					ctx.fillRect(x, h - peak.level * h, barW, 2 * dpr)
				}
			}
		}
	}, [getBarCount])

	const drawIdle = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		canvas.width = canvas.offsetWidth * window.devicePixelRatio
		canvas.height = canvas.offsetHeight * window.devicePixelRatio
		const ctx = canvas.getContext("2d")
		if (!ctx) return
		const { width: w, height: h } = canvas

		const dpr = window.devicePixelRatio
		const slot = (BAR_WIDTH + BAR_GAP) * dpr
		const barW = BAR_WIDTH * dpr
		const barCount = getBarCount(w, dpr)
		const stubH = 2 * dpr

		ctx.fillStyle = "rgba(148,163,184,0.25)"
		for (let i = 0; i < barCount; i++) {
			ctx.fillRect(i * slot, (h - stubH) / 2, barW, stubH)
		}
	}, [getBarCount])

	const decayLoop = useCallback(() => {
		if (isActiveRef.current) return

		const levels = levelsRef.current
		const peaks = peaksRef.current
		const now = Date.now()
		let anyVisible = false

		for (let i = 0; i < levels.length; i++) {
			levels[i] = (levels[i] ?? 0) * (1 - STOP_SMOOTHING)
			const peak = peaks[i]
			if (peak) {
				if (now > peak.heldUntil) {
					peak.level = Math.max(0, peak.level - PEAK_FALL_RATE)
				}
				if (peak.level > 0.005) anyVisible = true
			}
			if ((levels[i] ?? 0) > 0.005) anyVisible = true
		}

		drawFrame()

		if (anyVisible) {
			animFrameRef.current = requestAnimationFrame(decayLoop)
		} else {
			drawIdle()
		}
	}, [drawFrame, drawIdle])

	const draw = useCallback(() => {
		const canvas = canvasRef.current
		const dataArray = dataArrayRef.current
		if (!analyser || !dataArray || !canvas) return

		animFrameRef.current = requestAnimationFrame(draw)
		analyser.getByteFrequencyData(dataArray)

		const dpr = window.devicePixelRatio
		const { width: w } = canvas
		const barCount = getBarCount(w, dpr)
		const half = Math.ceil(barCount / 2)
		const binCount = dataArray.length
		const now = Date.now()

		if (levelsRef.current.length !== half) {
			levelsRef.current = Array(half).fill(0)
			peaksRef.current = Array.from({ length: half }, () => ({ level: 0, heldUntil: 0 }))
		}

		for (let i = 0; i < half; i++) {
			const startBin = Math.floor(Math.pow(i / half, 1.6) * binCount)
			const endBin = Math.floor(Math.pow((i + 1) / half, 1.6) * binCount)
			let sum = 0
			const count = Math.max(1, endBin - startBin)
			for (let b = startBin; b < endBin; b++) sum += dataArray[b] ?? 0
			const raw = Math.min(1, sum / count / 255)

			const prev = levelsRef.current[i] ?? 0
			const level = prev + (raw - prev) * (1 - SMOOTHING)
			levelsRef.current[i] = level

			const peak = peaksRef.current[i]!
			if (level >= peak.level) {
				peak.level = level
				peak.heldUntil = now + PEAK_HOLD_MS
			} else if (now > peak.heldUntil) {
				peak.level = Math.max(0, peak.level - PEAK_FALL_RATE)
			}
		}

		drawFrame()
	}, [analyser, getBarCount, drawFrame])

	useEffect(() => {
		drawIdle()
		window.addEventListener("resize", drawIdle)
		return () => window.removeEventListener("resize", drawIdle)
	}, [drawIdle])

	useEffect(() => {
		if (!isActive) drawIdle()
	}, [barOrigin, isActive, drawIdle])

	useEffect(() => {
		if (isActive && analyser) {
			const canvas = canvasRef.current
			if (canvas) {
				canvas.width = canvas.offsetWidth * window.devicePixelRatio
				canvas.height = canvas.offsetHeight * window.devicePixelRatio
			}
			dataArrayRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
			const barCount = getBarCount(canvasRef.current?.width ?? 0, window.devicePixelRatio)
			const half = Math.ceil(barCount / 2)
			levelsRef.current = Array(half).fill(0)
			peaksRef.current = Array.from({ length: half }, () => ({ level: 0, heldUntil: 0 }))
			draw()
		} else {
			cancelAnimationFrame(animFrameRef.current)
			animFrameRef.current = requestAnimationFrame(decayLoop)
		}
		return () => cancelAnimationFrame(animFrameRef.current)
	}, [isActive, analyser, draw, drawIdle, getBarCount, decayLoop])

	return (
		<div className={`overflow-hidden ${className || ""}`} {...props}>
			<canvas ref={canvasRef} className="block h-20 w-full" />
		</div>
	)
}
