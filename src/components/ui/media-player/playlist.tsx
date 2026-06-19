"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { TRACKS } from "."

interface PlayListProps {
	variant?: 1 | 2
	isOpen: boolean
	currentTrackIndex: number
	onTrackSelect: (index: number, shouldPlay: boolean) => void
}

const getFilenameFromSrc = (src: string): string => {
	const filename = src.split("/").pop() || src
	return filename.replace(/\.[^/.]+$/, "").replace(/_/g, " ") // clean display name
}

// metadata extraction
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

export function PlayList({ variant = 1, isOpen, currentTrackIndex, onTrackSelect }: PlayListProps) {
	const [trackNames, setTrackNames] = useState<string[]>([])

	// load metadata for all tracks
	useEffect(() => {
		const loadAllMetadata = async () => {
			const names = await Promise.all(
				TRACKS.map(async (track) => {
					const metaTitle = await extractId3v1Title(track)
					return metaTitle || getFilenameFromSrc(track)
				})
			)
			setTrackNames(names)
		}

		loadAllMetadata()
	}, [])

	return (
		<div
			className={`overflow-hidden transition-all duration-150 ease-in-out ${
				variant === 1 ? "absolute inset-0 z-10 bg-neutral-900" : variant === 2 ? "mt-4" : ""
			}`}
			style={{
				opacity: isOpen ? 1 : 0,
				maxHeight: variant === 2 ? (isOpen ? "31.25rem" : "0") : "",
				marginTop: variant === 2 ? (isOpen ? "" : "0") : "",
				pointerEvents: variant === 1 ? (isOpen ? "auto" : "none") : "auto",
			}}
		>
			<ScrollArea
				className={variant === 1 ? "flex h-full flex-col gap-1 p-2" : variant === 2 ? "flex flex-col gap-1" : ""}
			>
				{TRACKS.map((track, i) => {
					const displayName = trackNames[i] ?? getFilenameFromSrc(track)

					return (
						<button
							key={track}
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
			</ScrollArea>
		</div>
	)
}
