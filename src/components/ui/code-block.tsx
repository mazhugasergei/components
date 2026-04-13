"use client"

import { cn } from "@/utils/classname"
import { CopyButton } from "./copy-button"

interface Props extends React.ComponentProps<"div"> {
	highlightedCode: string
	themeBackground?: string
}

export function CodeBlock({ highlightedCode, themeBackground, className, ...props }: Props) {
	return (
		<div
			style={{ background: themeBackground ?? "var(--background)" }}
			className={cn("group relative overflow-hidden rounded-lg border", className)}
			{...props}
		>
			<div
				className="code-block-scrollbars max-h-96 overflow-auto text-white [&>pre]:inline-block [&>pre]:p-3 [&>pre]:font-mono [&>pre]:text-sm [&>pre]:[tab-size:2]"
				dangerouslySetInnerHTML={{
					__html: highlightedCode,
				}}
			/>
			<CopyButton
				text={highlightedCode.replace(/<[^>]*>/g, "")}
				className="absolute top-2 right-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
			/>
		</div>
	)
}
