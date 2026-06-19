"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DownloadIcon, LoaderIcon } from "./icons"
import { audioBufferToWav } from "./utils"

export interface DownloadButtonProps extends React.ComponentProps<typeof Button> {
	blob: Blob | null
	originalName?: string
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
