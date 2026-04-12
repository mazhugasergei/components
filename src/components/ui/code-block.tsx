"use client"

import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { createHighlighter } from "shiki"
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
	const [highlightedCode, setHighlightedCode] = useState<string>("")
	const { codeBlockTheme } = useStore()

	useEffect(() => {
		if (block.codeUrl && !block.code) {
			setLoading(true)
			setError("")

			fetch(`https://raw.githubusercontent.com/mazhugasergei/components/refs/heads/main/src/${block.codeUrl}`)
				.then((res) => {
					if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
					return res.text()
				})
				.then(setCode)
				.catch((err) => {
					setError(err.message || "Failed to load code")
					console.error("Error fetching code:", err)
				})
				.finally(() => setLoading(false))
		}
	}, [block.codeUrl, block.code])

	useEffect(() => {
		if (!code || !codeBlockTheme) return

		const highlight = async () => {
			try {
				const lang = getLang(block.filePath)

				const highlighter = await createHighlighter({
					themes: [codeBlockTheme],
					langs: [lang],
				})

				setHighlightedCode(highlighter.codeToHtml(code, { lang, theme: codeBlockTheme.name }))
			} catch (err) {
				console.error("Error highlighting code:", err)
				setHighlightedCode(`<pre><code>${code}</code></pre>`)
			}
		}

		highlight()
	}, [code, block.filePath, codeBlockTheme])

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
		<div
			style={codeBlockTheme ? { background: codeBlockTheme.colors?.["editor.background"] } : {}}
			className="group relative overflow-hidden rounded-lg border"
		>
			<div
				className="max-h-96 overflow-auto [&>pre]:inline-block [&>pre]:p-3 [&>pre]:font-mono [&>pre]:text-sm [&>pre]:[tab-size:2]"
				dangerouslySetInnerHTML={{ __html: highlightedCode || `<pre><code>${code}</code></pre>` }}
			/>
			<CopyButton
				text={code}
				className="absolute top-2 right-2 bg-inherit opacity-0 transition-opacity group-hover:opacity-100"
			/>
		</div>
	)
}

function getLang(filePath?: string) {
	const ext = filePath?.split(".").pop()
	switch (ext) {
		case "tsx":
			return "tsx"
		case "ts":
			return "typescript"
		case "jsx":
			return "jsx"
		case "js":
			return "javascript"
		case "css":
			return "css"
		default:
			return "typescript"
	}
}
