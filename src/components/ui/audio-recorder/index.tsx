"use client"

import { Button } from "@/components/ui/button"
import { ComponentProps, useCallback, useEffect, useRef, useState } from "react"
import { DownloadButton } from "./download-button"
import { PauseIcon, PlayIcon, RecordIcon } from "./icons"
import { Screen } from "./screen"

export function AudioRecorder({ className, ...props }: ComponentProps<"div">) {
	const audioPlayerRef = useRef<HTMLAudioElement>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const chunksRef = useRef<Blob[]>([])
	const streamRef = useRef<MediaStream | null>(null)
	const audioBlobRef = useRef<Blob | null>(null)

	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
	const [isRecording, setIsRecording] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [elapsed, setElapsed] = useState(0)
	const [playbackTime, setPlaybackTime] = useState<number | null>(null)
	const [status, setStatus] = useState<string | null>(null)
	const [hasRecording, setHasRecording] = useState(false)
	const [progress, setProgress] = useState(0)

	// live recording timer — independent of the canvas, just counts up while recording
	useEffect(() => {
		if (!isRecording) return
		const start = Date.now()
		const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 100)
		return () => clearInterval(id)
	}, [isRecording])

	const handleStop = useCallback(() => {
		const blob = new Blob(chunksRef.current, { type: "audio/webm" })
		audioBlobRef.current = blob
		if (audioPlayerRef.current) audioPlayerRef.current.src = URL.createObjectURL(blob)
		setHasRecording(true)
		// fresh recording, no playback position to show yet
		setPlaybackTime(null)
	}, [])

	const toggleRecord = useCallback(async () => {
		if (isRecording) {
			mediaRecorderRef.current?.stop()
			streamRef.current?.getTracks().forEach((t) => t.stop())
			setIsRecording(false)
			setAnalyser(null)
			return
		}

		try {
			setStatus(null)
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			streamRef.current = stream

			const AudioCtx =
				window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
			const audioCtx = new AudioCtx()
			const analyserNode = audioCtx.createAnalyser()
			analyserNode.fftSize = 2048
			audioCtx.createMediaStreamSource(stream).connect(analyserNode)

			const mr = new MediaRecorder(stream)
			mediaRecorderRef.current = mr
			chunksRef.current = []
			mr.ondataavailable = (e) => chunksRef.current.push(e.data)
			mr.onstop = handleStop
			mr.start()

			setIsRecording(true)
			setElapsed(0)
			setAnalyser(analyserNode)
		} catch {
			setStatus("mic access denied")
		}
	}, [isRecording, handleStop])

	const togglePlay = useCallback(() => {
		const player = audioPlayerRef.current
		if (!player || !hasRecording) return
		isPlaying ? player.pause() : player.play()
		setIsPlaying(!isPlaying)
	}, [isPlaying, hasRecording])

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
			// also captures the exact position when paused, since currentTime
			// doesn't change after pause — no separate "pause" listener needed
			setPlaybackTime(player.currentTime)
		}
		const onEnded = () => {
			setIsPlaying(false)
			setProgress(0)
			// played all the way through, fall back to showing total duration
			setPlaybackTime(null)
		}
		player.addEventListener("timeupdate", onTimeUpdate)
		player.addEventListener("ended", onEnded)
		return () => {
			player.removeEventListener("timeupdate", onTimeUpdate)
			player.removeEventListener("ended", onEnded)
		}
	}, [])

	// while recording: live recording timer
	// otherwise: playback position if there is one (mid-play or paused), else the recorded duration
	const displayTime = isRecording ? elapsed : (playbackTime ?? elapsed)

	return (
		<div
			className={`w-full max-w-md space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 ${className || ""}`}
			{...props}
		>
			<p className="text-[0.6875rem] tracking-[0.075rem] text-neutral-500 uppercase">audio recorder</p>

			<Screen analyser={analyser} isRecording={isRecording} status={status} />

			<div className="flex items-center gap-3">
				<RecordButton isRecording={isRecording} onClick={toggleRecord} disabled={isPlaying} />
				<PlayButton isPlaying={isPlaying} disabled={!hasRecording || isRecording} onClick={togglePlay} />
				<SeekBar progress={progress} onSeek={seekAudio} disabled={!hasRecording || isRecording} />
				<Duration time={displayTime} />
				<DownloadButton blob={audioBlobRef.current} originalName="recording" disabled={!hasRecording || isRecording} />
				<audio ref={audioPlayerRef} className="hidden" />
			</div>

			<DecorativeSpeakers />
		</div>
	)
}

export interface RecordButtonProps extends ComponentProps<"button"> {
	isRecording: boolean
}

export function RecordButton({ isRecording, ...props }: RecordButtonProps) {
	return (
		<Button
			aria-label={isRecording ? "Stop recording" : "Start recording"}
			variant="outline"
			size="icon"
			className={`${isRecording ? "border-red-400! bg-red-400/5! text-red-400! hover:bg-red-400/10!" : ""}`}
			{...props}
		>
			<RecordIcon isRecording={isRecording} className={isRecording ? "animate-pulse" : ""} />
		</Button>
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

export interface DurationProps extends ComponentProps<"span"> {
	time: number
}

export function Duration({ time, ...props }: DurationProps) {
	return (
		<span className="text-xs text-neutral-600 tabular-nums" {...props}>
			{Math.floor(time / 60)}:{String(Math.floor(time % 60)).padStart(2, "0")}
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
