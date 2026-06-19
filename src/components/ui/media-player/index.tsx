"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { ComponentProps, useCallback, useEffect, useRef, useState } from "react"
import { ListIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./icons"
import { Screen } from "./screen"

interface Track {
	src: string
}

const TRACKS: Track[] = [
	{ src: `${process.env["NEXT_PUBLIC_BASE_PATH"]}/audio/Elysium_Sound_-_Cosmic_Dreamer_-_Synthwave_Cyberpunk.mp3` },
	{ src: `${process.env["NEXT_PUBLIC_BASE_PATH"]}/audio/Greg_Kirkelie_-_1980s_Synthwave.mp3` },
	{
		src: `${process.env["NEXT_PUBLIC_BASE_PATH"]}/audio/Elysium_Sound_-_Stellar_Sunset_Middle_-_Synth_Pop_Retro_Music.mp3`,
	},
]

const getFilenameFromSrc = (src: string): string => {
	const filename = src.split("/").pop() || src
	return filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ") // clean display name
}

export interface MediaPlayerProps extends ComponentProps<"div"> {
	showDecorativeSpeakers?: boolean
}

export function MediaPlayer({ className, showDecorativeSpeakers = true, ...props }: MediaPlayerProps) {
	const audioPlayerRef = useRef<HTMLAudioElement>(null)
	const audioCtxRef = useRef<AudioContext | null>(null)
	const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)

	const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [progress, setProgress] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [trackIndex, setTrackIndex] = useState(0)
	const [isPlaylistOpen, setPlaylistOpen] = useState(false)
	const [trackNames, setTrackNames] = useState<string[]>([])

	const currentTrackSrc = TRACKS[trackIndex]!.src

	// ==================== METADATA EXTRACTION ====================
	const extractId3v1Title = async (url: string): Promise<string | null> => {
		try {
			const res = await fetch(url)
			if (!res.ok) return null
			const arrayBuffer = await res.arrayBuffer()
			const dv = new DataView(arrayBuffer)

			const fileSize = arrayBuffer.byteLength
			if (fileSize < 128) return null

			const tagOffset = fileSize - 128
			const tag = String.fromCharCode(dv.getUint8(tagOffset), dv.getUint8(tagOffset + 1), dv.getUint8(tagOffset + 2))

			if (tag !== "TAG") return null

			let title = ""
			for (let i = 0; i < 30; i++) {
				const byte = dv.getUint8(tagOffset + 3 + i)
				if (byte === 0) break
				title += String.fromCharCode(byte)
			}

			return title.trim() || null
		} catch {
			return null
		}
	}

	// load metadata for all tracks
	useEffect(() => {
		const loadAllMetadata = async () => {
			const names = await Promise.all(
				TRACKS.map(async (track) => {
					const metaTitle = await extractId3v1Title(track.src)
					return metaTitle || getFilenameFromSrc(track.src)
				})
			)
			setTrackNames(names)
		}

		loadAllMetadata()
	}, [])

	// ==================== PLAYER LOGIC ====================
	const ensureAnalyser = useCallback(() => {
		const player = audioPlayerRef.current
		if (!player || audioCtxRef.current) return

		const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
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

	const playTrack = useCallback(
		async (index: number, shouldPlay: boolean) => {
			const player = audioPlayerRef.current
			if (!player) return

			ensureAnalyser()

			if (audioCtxRef.current?.state === "suspended") {
				await audioCtxRef.current.resume()
			}

			setTrackIndex(index)
			setProgress(0)
			setCurrentTime(0)
			setDuration(0)

			player.src = TRACKS[index]!.src

			if (shouldPlay) {
				const onCanPlay = async () => {
					player.removeEventListener("canplay", onCanPlay)
					try {
						await player.play()
						setIsPlaying(true)
					} catch {
						setIsPlaying(false)
					}
				}
				player.addEventListener("canplay", onCanPlay)
			} else {
				setIsPlaying(false)
			}

			player.load()
		},
		[ensureAnalyser]
	)

	const togglePlay = useCallback(async () => {
		const player = audioPlayerRef.current
		if (!player) return

		ensureAnalyser()

		if (audioCtxRef.current?.state === "suspended") {
			await audioCtxRef.current.resume()
		}

		if (isPlaying) {
			player.pause()
			setIsPlaying(false)
		} else {
			await player.play()
			setIsPlaying(true)
		}
	}, [isPlaying, ensureAnalyser])

	const prevTrack = useCallback(() => {
		const player = audioPlayerRef.current
		if (!player) return

		// if we've passed 3 seconds, restart the current track from the beginning
		if (currentTime >= 3) {
			player.currentTime = 0
			setProgress(0)
			setCurrentTime(0)

			// ensure it's playing
			if (!isPlaying) {
				player.play().catch(() => {
					setIsPlaying(false)
				})
				setIsPlaying(true)
			}
		} else {
			// otherwise go to the previous track
			const idx = (trackIndex - 1 + TRACKS.length) % TRACKS.length
			playTrack(idx, true)
		}
	}, [currentTime, trackIndex, playTrack, isPlaying])

	const nextTrack = useCallback(() => {
		const idx = (trackIndex + 1) % TRACKS.length
		playTrack(idx, true)
	}, [trackIndex, playTrack])

	const seekAudio = useCallback((value: number) => {
		const player = audioPlayerRef.current
		if (!player || !player.duration) return
		player.currentTime = (value / 100) * player.duration
	}, [])

	useEffect(() => {
		const player = audioPlayerRef.current
		if (!player) return

		const updateDuration = () => {
			if (player.duration && isFinite(player.duration)) setDuration(player.duration)
		}
		const onTimeUpdate = () => {
			if (!player.duration) return
			setProgress((player.currentTime / player.duration) * 100)
			setCurrentTime(player.currentTime)
		}
		const onEnded = () => {
			const next = (trackIndex + 1) % TRACKS.length
			playTrack(next, true)
		}

		player.addEventListener("loadedmetadata", updateDuration)
		player.addEventListener("durationchange", updateDuration)
		player.addEventListener("canplay", updateDuration)
		player.addEventListener("timeupdate", onTimeUpdate)
		player.addEventListener("ended", onEnded)
		updateDuration()

		return () => {
			player.removeEventListener("loadedmetadata", updateDuration)
			player.removeEventListener("durationchange", updateDuration)
			player.removeEventListener("canplay", updateDuration)
			player.removeEventListener("timeupdate", onTimeUpdate)
			player.removeEventListener("ended", onEnded)
		}
	}, [trackIndex, playTrack])

	useEffect(() => {
		return () => {
			audioCtxRef.current?.close()
		}
	}, [])

	const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`

	return (
		<div
			className={`w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 ${className || ""}`}
			{...props}
		>
			<div className="flex items-center justify-between">
				<p className="text-[0.6875rem] tracking-[0.075rem] text-neutral-500 uppercase">media player</p>
			</div>

			{/* screen */}
			<div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900">
				<Screen analyser={analyser} isActive={isPlaying} barOrigin="center" className="my-1" />
			</div>

			{/* controls */}
			<div className="mt-4 flex items-center gap-3">
				<div className="flex items-center gap-2">
					<PrevButton size="icon-sm" onClick={prevTrack} />
					<PlayButton size="icon-sm" isPlaying={isPlaying} onClick={togglePlay} />
					<NextButton size="icon-sm" onClick={nextTrack} />{" "}
				</div>
				<span className="text-xs text-neutral-600 tabular-nums">{fmt(currentTime)}</span>
				<SeekBar progress={progress} onSeek={seekAudio} />
				<span className="text-xs text-neutral-600 tabular-nums">{fmt(duration)}</span>

				<button
					onClick={() => setPlaylistOpen((o) => !o)}
					className="-m-2 p-2 text-[0.6875rem] tracking-[0.075rem] text-neutral-500 uppercase transition-colors hover:text-neutral-300"
				>
					<ListIcon />
				</button>
			</div>

			<PlayList
				isOpen={isPlaylistOpen}
				tracks={TRACKS}
				trackNames={trackNames}
				currentTrackIndex={trackIndex}
				onTrackSelect={playTrack}
			/>

			<audio ref={audioPlayerRef} src={currentTrackSrc} preload="metadata" className="hidden" />

			{showDecorativeSpeakers && <DecorativeSpeakers className="mt-4" />}
		</div>
	)
}

interface PlayListProps {
	isOpen: boolean
	tracks: Track[]
	trackNames: string[]
	currentTrackIndex: number
	onTrackSelect: (index: number, shouldPlay: boolean) => void
}

export function PlayList({ isOpen, tracks, trackNames, currentTrackIndex, onTrackSelect }: PlayListProps) {
	return (
		<div
			className="mt-4 overflow-hidden transition-all duration-300 ease-in-out"
			style={{
				maxHeight: isOpen ? "31.25rem" : "0",
				marginTop: isOpen ? "" : "0",
				opacity: isOpen ? 1 : 0,
			}}
		>
			<div className="flex flex-col gap-1">
				{tracks.map((track, i) => {
					const displayName = trackNames[i] ?? getFilenameFromSrc(track.src)

					return (
						<button
							key={track.src}
							onClick={() => onTrackSelect(i, true)}
							className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
								i === currentTrackIndex
									? "bg-neutral-800 text-neutral-100"
									: "text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300"
							}`}
						>
							<span className="w-4 shrink-0 text-center text-[0.6875rem] text-neutral-600 tabular-nums">{i + 1}</span>
							<span className="text-[0.6875rem] tracking-[0.075rem]">{displayName}</span>
						</button>
					)
				})}
			</div>
		</div>
	)
}

export function PlayButton({ isPlaying, ...props }: { isPlaying: boolean } & ButtonProps) {
	return (
		<Button aria-label={isPlaying ? "Pause" : "Play"} variant="outline" size="icon" {...props}>
			{isPlaying ? <PauseIcon /> : <PlayIcon />}
		</Button>
	)
}

export function PrevButton(props: ButtonProps) {
	return (
		<Button aria-label="Previous" variant="outline" size="icon" {...props}>
			<PrevIcon />
		</Button>
	)
}

export function NextButton(props: ButtonProps) {
	return (
		<Button aria-label="Next" variant="outline" size="icon" {...props}>
			<NextIcon />
		</Button>
	)
}

interface SeekBarProps extends Omit<ComponentProps<"div">, "onChange"> {
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
				className={`absolute inset-0 h-full w-full appearance-none bg-transparent [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent`}
			/>
		</div>
	)
}

export function DecorativeSpeakers({ className, ...props }: ComponentProps<"div">) {
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
		<div
			ref={containerRef}
			className={`relative w-full ${className || ""}`}
			style={{ aspectRatio: `${ASPECT_RATIO}` }}
			{...props}
		>
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
