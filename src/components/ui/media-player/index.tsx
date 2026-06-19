"use client"

import { Button } from "@/components/ui/button"
import { ComponentProps, useCallback, useEffect, useRef, useState } from "react"
import { PauseIcon, PlayIcon } from "./icons"
import { Screen } from "./screen"

export function MediaPlayer({ className, ...props }: ComponentProps<"div">) {
	const audioPlayerRef = useRef<HTMLAudioElement>(null)
	const audioCtxRef = useRef<AudioContext | null>(null)
	const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)

	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	const ensureAnalyser = useCallback(() => {
		const player = audioPlayerRef.current
		if (!player || audioCtxRef.current) return

		const AudioCtx =
			window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
		const ctx = new AudioCtx()
		audioCtxRef.current = ctx

		const analyserNode = ctx.createAnalyser()
		analyserNode.fftSize = 2048

		const source = ctx.createMediaElementSource(player)
		sourceNodeRef.current = source
		source.connect(analyserNode)
		analyserNode.connect(ctx.destination)

		setAnalyser(analyserNode)
	}, [])

	const togglePlay = useCallback(async () => {
		const player = audioPlayerRef.current
		if (!player) return

		ensureAnalyser()

		if (audioCtxRef.current?.state === "suspended") {
			await audioCtxRef.current.resume()
		}

		if (isPlaying) {
			player.pause()
		} else {
			await player.play()
		}
		setIsPlaying(!isPlaying)
	}, [isPlaying, ensureAnalyser])

	const seekAudio = useCallback((value: number) => {
		const player = audioPlayerRef.current
		if (!player || !player.duration) return
		player.currentTime = (value / 100) * player.duration
	}, [])

	useEffect(() => {
		const player = audioPlayerRef.current
		if (!player) return

		const onTimeUpdate = () => {
			if (!player.duration) return
			setProgress((player.currentTime / player.duration) * 100)
			setCurrentTime(player.currentTime)
		}
		const onLoadedMetadata = () => setDuration(player.duration)
		const onEnded = () => {
			setIsPlaying(false)
			setProgress(0)
			setCurrentTime(0)
		}

		player.addEventListener("timeupdate", onTimeUpdate)
		player.addEventListener("loadedmetadata", onLoadedMetadata)
		player.addEventListener("ended", onEnded)
		return () => {
			player.removeEventListener("timeupdate", onTimeUpdate)
			player.removeEventListener("loadedmetadata", onLoadedMetadata)
			player.removeEventListener("ended", onEnded)
		}
	}, [])

	useEffect(() => {
		return () => {
			audioCtxRef.current?.close()
		}
	}, [])

	return (
		<div
			className={`w-full max-w-md space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 ${className || ""}`}
			{...props}
		>
			<div className="flex justify-between gap-4">
				<p className="text-[0.6875rem] tracking-[0.075rem] text-neutral-500 uppercase">media player</p>
				<Time time={currentTime} total={duration} />
			</div>

			<Screen
				analyser={analyser}
				isActive={isPlaying}
				barOrigin="center"
				className="rounded-xl border border-neutral-800 bg-neutral-900"
			/>

			<div className="flex items-center gap-3">
				<PlayButton isPlaying={isPlaying} onClick={togglePlay} />
				<SeekBar progress={progress} onSeek={seekAudio} />
			</div>

			<audio ref={audioPlayerRef} src={"./audio.mp3"} preload="metadata" className="hidden" />

			<DecorativeSpeakers />
		</div>
	)
}

export interface PlayButtonProps extends ComponentProps<"button"> {
	isPlaying: boolean
}

export function PlayButton({ isPlaying, ...props }: PlayButtonProps) {
	return (
		<Button aria-label={isPlaying ? "Pause" : "Play"} variant="outline" size="icon" {...props}>
			{isPlaying ? <PauseIcon /> : <PlayIcon />}
		</Button>
	)
}

export interface SeekBarProps extends Omit<ComponentProps<"div">, "onChange"> {
	progress: number
	disabled?: boolean
	onSeek?: (value: number) => void
}

export function SeekBar({ progress, disabled, className, onSeek, ...props }: SeekBarProps) {
	return (
		<div className={`relative isolate h-5 flex-1 ${className || ""}`} {...props}>
			<div className="absolute top-1/2 -z-10 h-1 w-full -translate-y-1/2 rounded-full bg-neutral-800" />
			<div
				className="pointer-events-none absolute top-1/2 -z-10 h-1 -translate-y-1/2 rounded-full bg-neutral-400 transition-[width] duration-100"
				style={{ width: `${progress}%` }}
			/>
			<input
				type="range"
				min={0}
				max={100}
				value={progress}
				disabled={disabled}
				onChange={(e) => onSeek?.(Number(e.target.value))}
				className={`absolute inset-0 h-full w-full appearance-none bg-transparent ${disabled ? "" : "cursor-pointer"} [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent`}
			/>
		</div>
	)
}

export interface TimeProps extends ComponentProps<"span"> {
	time: number
	total?: number
}

export function Time({ time, total, ...props }: TimeProps) {
	const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`

	return (
		<span className="text-xs text-neutral-600 tabular-nums" {...props}>
			{fmt(time)}
			{total ? ` / ${fmt(total)}` : ""}
		</span>
	)
}

export function DecorativeSpeakers() {
	const ASPECT_RATIO = 10 / 1
	const DOT_SIZE = 3
	const DOT_GAP = 5

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
