"use client"

import { CopyButton } from "./copy-button"

interface CodeBlockProps {
	title: string
	code?: string
	codeUrl?: string
	filePath?: string
	highlightedCode?: string
	error?: string
	themeBackground?: string
}

export function CodeBlock({ code, highlightedCode, error, themeBackground }: CodeBlockProps) {
	if (error) {
		return (
			<div className="bg-destructive/10 text-destructive max-h-96 overflow-auto rounded-lg border p-3 font-mono text-sm">
				Error loading code: {error}
			</div>
		)
	}

	return (
		<div
			style={themeBackground ? { background: themeBackground } : {}}
			className="group relative overflow-hidden rounded-lg border"
		>
			<div
				className="code-block-scrollbars max-h-96 overflow-auto text-white [&>pre]:inline-block [&>pre]:p-3 [&>pre]:font-mono [&>pre]:text-sm [&>pre]:[tab-size:2]"
				dangerouslySetInnerHTML={{
					__html: highlightedCode || `<pre><code>${code || ""}</code></pre>`,
				}}
			/>
			<CopyButton
				text={code || ""}
				className="absolute top-2 right-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
			/>
		</div>
	)
}
