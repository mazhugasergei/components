"use client"

import { cn } from "@/utils/classname"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface CopyButtonProps {
	text: string
	className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
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
				"bg-muted text-muted-foreground hover:bg-accent hover:text-foreground flex h-6 w-6 items-center justify-center rounded border transition-colors",
				className
			)}
			aria-label="Copy to clipboard"
		>
			{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
		</button>
	)
}
