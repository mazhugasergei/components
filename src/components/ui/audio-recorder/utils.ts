export function formatTime(s: number): string {
	const m = Math.floor(s / 60)
	return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`
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
