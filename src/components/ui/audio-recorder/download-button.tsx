"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DownloadIcon, LoaderIcon } from "./icons"

export interface DownloadButtonProps extends React.ComponentProps<typeof Button> {
	blob: Blob | null
	originalName?: string
}

export function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
	const numOfChan = buffer.numberOfChannels
	const length = buffer.length * numOfChan * 2 + 44
	const result = new ArrayBuffer(length)
	const view = new DataView(result)
	const channels: Float32Array[] = []
	let offset = 0
	let pos = 0

	const writeString = (str: string) => {
		for (let i = 0; i < str.length; i++) {
			view.setUint8(pos++, str.charCodeAt(i))
		}
	}

	// Write WAV header
	writeString("RIFF")
	view.setUint32(pos, length - 8, true)
	pos += 4
	writeString("WAVE")
	writeString("fmt ")
	view.setUint32(pos, 16, true)
	pos += 4
	view.setUint16(pos, 1, true)
	pos += 2 // PCM
	view.setUint16(pos, numOfChan, true)
	pos += 2
	view.setUint32(pos, buffer.sampleRate, true)
	pos += 4
	view.setUint32(pos, buffer.sampleRate * numOfChan * 2, true)
	pos += 4
	view.setUint16(pos, numOfChan * 2, true)
	pos += 2
	view.setUint16(pos, 16, true)
	pos += 2
	writeString("data")
	view.setUint32(pos, length - pos - 4, true)
	pos += 4

	// Extract channel data
	for (let i = 0; i < numOfChan; i++) {
		channels.push(buffer.getChannelData(i))
	}

	// Interleave samples (TypeScript-safe)
	const maxSamples = buffer.length
	while (offset < maxSamples) {
		for (let i = 0; i < numOfChan; i++) {
			const sample = channels[i]?.[offset] ?? 0 // Safe access with fallback

			const clamped = Math.max(-1, Math.min(1, sample))
			const scaled = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff

			view.setInt16(pos, scaled | 0, true) // | 0 ensures integer
			pos += 2
		}
		offset++
	}

	return result
}

export function DownloadButton({ blob, originalName = "recording", disabled, ...props }: DownloadButtonProps) {
	const [loading, setLoading] = useState(false)

	const convertToWav = async () => {
		if (!blob) return
		setLoading(true)

		try {
			const arrayBuffer = await blob.arrayBuffer()
			const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

			const wavBuffer = audioBufferToWav(audioBuffer) // pure JS function below

			const wavBlob = new Blob([wavBuffer], { type: "audio/wav" })

			const url = URL.createObjectURL(wavBlob)
			const a = document.createElement("a")
			a.href = url
			a.download = `${originalName}-${Date.now()}.wav`
			a.click()
			URL.revokeObjectURL(url)

			// Optional: close context to free memory
			audioContext.close()
		} catch (err) {
			console.error("Conversion failed:", err)
			alert("Failed to convert audio. Try recording in a different format or browser.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button
			aria-label="Download the recording"
			variant="outline"
			size="icon"
			onClick={convertToWav}
			disabled={!blob || loading || disabled}
			{...props}
		>
			{loading ? <LoaderIcon className="animate-spin" /> : <DownloadIcon />}
		</Button>
	)
}
