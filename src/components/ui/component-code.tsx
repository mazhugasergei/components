"use client"

import { cn } from "@/utils/classname"
import { CopyButton } from "./copy-button"

interface ComponentCodeProps {
	codeBlocks: Array<{
		title: string
		code: string
		filePath?: string
	}>
	className?: string
}

export function ComponentCode({ codeBlocks, className }: ComponentCodeProps) {
	return (
		<div className={cn("space-y-3", className)}>
			{codeBlocks.map((block, index) => (
				<div key={index} className="space-y-2">
					<div className="flex items-center justify-between">
						<h5 className="text-foreground font-mono text-xs font-medium">{block.title}</h5>
						{block.filePath && <span className="text-muted-foreground font-mono text-xs">{block.filePath}</span>}
					</div>
					<div className="group relative">
						<div className="bg-muted text-muted-foreground max-h-96 overflow-auto rounded-lg border font-mono text-sm">
							<pre className="inline-block p-3 whitespace-pre">{block.code}</pre>
						</div>
						<CopyButton
							text={block.code}
							className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
						/>
					</div>
				</div>
			))}
		</div>
	)
}
