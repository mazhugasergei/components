export interface Component {
	title: string
	description: string
	tag: string
	examples: React.ReactNode[]
	notice?: React.ReactNode
	codeBlocks: CodeBlock[]
}

export interface CodeBlock {
	codeUrl?: string
	filePath?: string
	code?: string
}

export interface ProcessedCodeBlock {
	filePath?: string
	highlightedCode: string
	themeBackground?: string
}

export interface ProcessedComponent {
	title: string
	description: string
	examples: any[]
	notice?: React.ReactNode
	codeBlocks: ProcessedCodeBlock[]
}
