"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/utils/classname"

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
			<ScrollArea
				className="max-h-80 overflow-auto text-white [&>pre]:inline-block [&>pre]:p-3 [&>pre]:font-mono [&>pre]:text-sm [&>pre]:[tab-size:2]"
				dangerouslySetInnerHTML={{ __html: highlightedCode }}
			/>
		</div>
	)
}
