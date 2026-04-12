import { createHighlighter } from "shiki"
import { components } from "./constants"

interface ProcessedCodeBlock {
	title: string
	code?: string
	codeUrl?: string
	filePath?: string
	highlightedCode?: string
	error?: string
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
		if (!themeResponse.ok) {
			throw new Error("Failed to fetch theme")
		}
		const theme = await themeResponse.json()

		// Create highlighter once for all code blocks
		const highlighter = await createHighlighter({
			themes: [theme],
			langs: ["tsx", "typescript", "jsx", "javascript", "css"],
		})

		// Process all components
		return await Promise.all(
			components.map(async (component) => {
				const processedCodeBlocks = await Promise.all(
					component.codeBlocks.map(async (block): Promise<ProcessedCodeBlock> => {
						if (block.code) {
							// Code is already provided, just highlight it
							const lang = getLang(block.filePath)
							return {
								...block,
								highlightedCode: highlighter.codeToHtml(block.code, {
									lang,
									theme: theme.name,
								}),
								themeBackground: theme.colors?.["editor.background"],
							}
						} else if (block.codeUrl) {
							// Fetch code from GitHub and highlight it
							try {
								const res = await fetch(
									`https://raw.githubusercontent.com/mazhugasergei/components/refs/heads/main/src/${block.codeUrl}`
								)
								if (!res.ok) {
									throw new Error(`Failed to fetch: ${res.statusText}`)
								}
								const code = await res.text()
								const lang = getLang(block.filePath)
								return {
									...block,
									code,
									highlightedCode: highlighter.codeToHtml(code, {
										lang,
										theme: theme.name,
									}),
									themeBackground: theme.colors?.["editor.background"],
								}
							} catch (err) {
								return {
									...block,
									error: err instanceof Error ? err.message : "Failed to load code",
								}
							}
						}
						return block
					})
				)

				return {
					...component,
					codeBlocks: processedCodeBlocks,
				}
			})
		)
	} catch (err) {
		console.error("Error processing code blocks:", err)
		return components
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
