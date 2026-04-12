"use client"

import { Button } from "@/components/ui/button"
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
		<Button
			variant="outline"
			size="xs"
			onClick={handleCopy}
			className={cn("border-white/20! bg-inherit! text-white/80! hover:bg-white/5! hover:text-white!", className)}
			aria-label="Copy to clipboard"
			{...props}
		>
			{copied ? <TextMorph>Copied</TextMorph> : <TextMorph>Copy</TextMorph>}
		</Button>
	)
}
