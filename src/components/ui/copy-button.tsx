"use client"

import { cn } from "@/utils/classname"
import { useState } from "react"
import { TextMorph } from "torph/react"

interface Props extends React.ComponentProps<"button"> {
	text: string
}

export function CopyButton({ text, className, ...props }: Props) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy text: ", err)
		}
	}

	return (
		<button
			onClick={handleCopy}
			className={cn(
				"bg-muted text-muted-foreground hover:bg-accent hover:text-foreground flex items-center justify-center rounded-lg border px-2 py-0.5 text-xs transition-colors",
				className
			)}
			aria-label="Copy to clipboard"
			{...props}
		>
			{copied ? <TextMorph>Copied</TextMorph> : <TextMorph>Copy</TextMorph>}
		</button>
	)
}
