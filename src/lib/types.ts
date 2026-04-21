export interface Component {
	title: string
	description: string
	codeBlocks: CodeBlock[]
	examples: React.ReactNode[]
}

export interface CodeBlock {
	codeUrl?: string
	filePath?: string
	code?: string
}

export interface ProcessedCodeBlock {
	title: string
	filePath?: string
	highlightedCode: string
	themeBackground?: string
}

export interface ProcessedComponent {
	title: string
	description: string
	codeBlocks: ProcessedCodeBlock[]
	examples: any[]
}
