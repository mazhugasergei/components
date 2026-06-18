"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Converter } from "./converter"
import { DecorativeSpeakers } from "./decorative-speakers"
import { Duration } from "./duration"
import { PlayButton } from "./play-button"
import { RecordButton } from "./record-button"
import { Screen } from "./screen"
import { SeekBar } from "./seek-bar"

export function AudioRecorder() {
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

	const seekAudio = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const player = audioPlayerRef.current
		if (!player || !player.duration) return
		const rect = e.currentTarget.getBoundingClientRect()
		const pct = (e.clientX - rect.left) / rect.width
		player.currentTime = pct * player.duration
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
		<div className="w-full max-w-md space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
			<p className="text-[0.6875rem] tracking-[0.075rem] text-neutral-500 uppercase">audio recorder</p>

			<Screen analyser={analyser} isRecording={isRecording} status={status} />

			<div className="flex items-center gap-3">
				<RecordButton isRecording={isRecording} onClick={toggleRecord} disabled={isPlaying} />
				<PlayButton isPlaying={isPlaying} disabled={!hasRecording || isRecording} onClick={togglePlay} />
				<SeekBar progress={progress} onClick={seekAudio} disabled={!hasRecording || isRecording} />
				<Duration time={displayTime} />
				<Converter blob={audioBlobRef.current} originalName="recording" disabled={!hasRecording || isRecording} />
				<audio ref={audioPlayerRef} className="hidden" />
			</div>

			<DecorativeSpeakers />
		</div>
	)
}
