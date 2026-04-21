import { logger } from "@/utils/logger"
import { createHighlighter } from "shiki"
import { components } from "./constants"
import { ProcessedCodeBlock, ProcessedComponent } from "./types"

// Maintain highlighter instance
let highlighter: any = null

export async function processCodeBlocks(): Promise<ProcessedComponent[]> {
	try {
		// Cache-buster to bypass GitHub Raw CDN (refreshes every build)
		const cacheBuster = `?t=${Date.now()}`

		// Fetch theme with cache buster
		const themeUrl = `https://raw.githubusercontent.com/mazhugasergei/theme-builder/refs/heads/main/themes/theme.json${cacheBuster}`
		const themeResponse = await fetch(themeUrl)

		if (!themeResponse.ok) {
			throw new Error(`Failed to fetch theme from ${themeUrl}: ${themeResponse.statusText}`)
		}
		const theme = await themeResponse.json()

		// Initialize highlighter if it doesn't exist
		// Note: If you change your theme name, you might need to re-initialize this
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
						let code: string

						if (block.codeUrl) {
							// Fetch code from GitHub with cache buster
							const codeUrl = `https://raw.githubusercontent.com/mazhugasergei/components/refs/heads/main/src/${block.codeUrl}${cacheBuster}`
							const res = await fetch(codeUrl)

							if (!res.ok) {
								throw new Error(`failed to fetch ${block.codeUrl}: ${res.statusText}`)
							}
							code = await res.text()
						} else if ("code" in block && block.code) {
							// Use inline code
							code = block.code
						} else {
							throw new Error(`code block "${block.filePath}" must have either codeUrl or code`)
						}

						const lang = getLang(block.filePath)

						// Generate HTML using the fetched theme name
						const highlightedCode = highlighter.codeToHtml(code, {
							lang,
							theme: theme.name,
						})

						return {
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
