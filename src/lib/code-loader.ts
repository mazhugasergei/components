import { logger } from "@/utils/logger"
import { createHighlighter } from "shiki"
import { components } from "./constants"

let highlighter: any = null

interface ProcessedCodeBlock {
	title: string
	filePath?: string
	highlightedCode: string
	themeBackground?: string
}

export async function processCodeBlocks(): Promise<
	Array<{
		title: string
		description: string
		badgeColor: "blue" | "green"
		codeBlocks: ProcessedCodeBlock[]
		examples: any[]
	}>
> {
	try {
		// Fetch theme
		const themeResponse = await fetch(
			"https://raw.githubusercontent.com/mazhugasergei/theme-builder/refs/heads/main/themes/theme.json"
		)
		if (!themeResponse.ok) throw new Error("Failed to fetch theme")
		const theme = await themeResponse.json()

		// Create highlighter once for all code blocks
		if (!highlighter) {
			highlighter = await createHighlighter({
				themes: [theme],
				langs: ["tsx", "typescript", "jsx", "javascript", "css"],
			})
		}

		// Process all components
		return await Promise.all(
			components.map(async (component) => {
				const processedCodeBlocks = await Promise.all(
					component.codeBlocks.map(async (block): Promise<ProcessedCodeBlock> => {
						if (!block.codeUrl) throw new Error(`code block "${block.title}" must have codeUrl`)

						// Fetch code from GitHub
						const res = await fetch(
							`https://raw.githubusercontent.com/mazhugasergei/components/refs/heads/main/src/${block.codeUrl}`
						)
						if (!res.ok) throw new Error(`failed to fetch ${block.codeUrl}: ${res.statusText}`)

						const code = await res.text()

						const lang = getLang(block.filePath)
						const highlightedCode = highlighter.codeToHtml(code, {
							lang,
							theme: theme.name,
						})

						return {
							title: block.title,
							filePath: block.filePath,
							highlightedCode,
							themeBackground: theme.colors?.["editor.background"],
						}
					})
				)

				return {
					...component,
					codeBlocks: processedCodeBlocks,
				}
			})
		)
	} catch (err) {
		const errorMessage = `Failed to process code blocks: ${err instanceof Error ? err.message : String(err)}`
		logger.error(errorMessage, "ERROR")
		throw new Error(errorMessage)
	}
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
