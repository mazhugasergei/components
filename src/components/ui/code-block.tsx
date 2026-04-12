"use client"

import { useEffect, useState } from "react"
import { CopyButton } from "./copy-button"

interface ComponentCodeProps {
	codeBlocks: Array<{
		title: string
		code?: string
		codeUrl?: string
		filePath?: string
	}>
	className?: string
}

export function CodeBlock({ block }: { block: ComponentCodeProps["codeBlocks"][0] }) {
	const [code, setCode] = useState<string>(block.code || "")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string>("")

	useEffect(() => {
		if (block.codeUrl && !block.code) {
			setLoading(true)
			setError("")

			fetch(`https://raw.githubusercontent.com/mazhugasergei/components/refs/heads/main/src/${block.codeUrl}`)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to fetch: ${response.statusText}`)
					}
					return response.text()
				})
				.then((text) => {
					setCode(text)
				})
				.catch((err) => {
					setError(err.message || "Failed to load code")
					console.error("Error fetching code:", err)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [block.codeUrl, block.code])

	if (loading) {
		return (
			<div className="bg-muted text-muted-foreground max-h-96 overflow-auto rounded-lg border p-3 font-mono text-sm">
				Loading code from GitHub...
			</div>
		)
	}

	if (error) {
		return (
			<div className="bg-destructive/10 text-destructive max-h-96 overflow-auto rounded-lg border p-3 font-mono text-sm">
				Error loading code: {error}
			</div>
		)
	}

	return (
		<div className="group relative overflow-hidden rounded-lg border">
			<div className="bg-muted text-muted-foreground max-h-96 overflow-auto font-mono text-sm">
				<pre className="inline-block p-3 whitespace-pre">{code}</pre>
			</div>
			<CopyButton text={code} className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100" />
		</div>
	)
}
