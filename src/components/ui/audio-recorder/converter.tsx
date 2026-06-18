"use client"

import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { useRef, useState } from "react"
import { Button } from "./button"
import { DownloadIcon, LoaderIcon } from "./icons"

const FORMAT = "wav"

export interface ConverterProps extends React.ComponentProps<typeof Button> {
	blob: Blob | null
	originalName?: string
}

export function Converter({ blob, originalName = "recording", disabled, ...props }: ConverterProps) {
	const ffmpegRef = useRef<FFmpeg | null>(null)
	const [loading, setLoading] = useState(false)

	const convert = async () => {
		if (!blob) return
		setLoading(true)
		try {
			const ff = ffmpegRef.current!

			await ff.writeFile("input.webm", await fetchFile(blob))

			await ff.exec(["-i", "input.webm", "-ar", "22050", "-ac", "1", `output.${FORMAT}`])
			const data = await ff.readFile(`output.${FORMAT}`)
			const converted = new Blob([data as BlobPart], { type: `audio/${FORMAT}` })

			const url = URL.createObjectURL(converted)
			const a = document.createElement("a")
			a.href = url
			a.download = `${originalName}-${Date.now()}.${FORMAT}`
			a.click()
			URL.revokeObjectURL(url)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button onClick={convert} disabled={!blob || loading || disabled} {...props}>
			{loading ? <LoaderIcon className="animate-spin" /> : <DownloadIcon />}
		</Button>
	)
}
