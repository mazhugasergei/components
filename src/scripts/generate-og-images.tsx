import { components } from "@/lib/constants"
import { toKebabCase } from "@/utils/text"
import { ImageResponse } from "@vercel/og"
import fs from "fs"
import path from "path"

const OUT_DIR = path.join(process.cwd(), "public", "og")
const SIZE = { width: 1200, height: 630 }

function parseCssVariables(theme: "light" | "dark" = "dark") {
	const css = fs.readFileSync(path.join(process.cwd(), "src/assets/styles/globals.css"), "utf-8")

	const block = theme === "dark" ? css.match(/\.dark\s*\{([^}]+)\}/)?.[1] : css.match(/:root\s*\{([^}]+)\}/)?.[1]

	if (!block) throw new Error(`Could not parse ${theme} theme from globals.css`)

	return Object.fromEntries(
		[...block.matchAll(/--(\w[\w-]*):\s*([^;]+);/g)].map(([, key, value]) => [key, value?.trim()])
	)
}

const vars = parseCssVariables("dark")

const colors = {
	background: vars["background"],
	foreground: vars["foreground"],
	mutedForeground: vars["muted-foreground"],
	border: vars["border"],
}

async function ogImage({
	eyebrow,
	title,
	description,
	footer,
	fontData,
}: {
	eyebrow?: string
	title: string
	description?: string
	footer?: string
	fontData: ArrayBuffer
}) {
	const techStack = ["Next.js", "TypeScript", "Tailwind CSS"]

	return new ImageResponse(
		<div
			style={{
				background: colors.background,
				color: colors.foreground,
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "72px 80px",
				fontFamily: "Geist",
			}}
		>
			{/* Logo */}
			<span style={{ color: colors.foreground, fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>
				components
			</span>

			{/* Body */}
			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				{eyebrow && (
					<p
						style={{
							color: colors.mutedForeground,
							fontSize: 14,
							letterSpacing: "0.15em",
							textTransform: "uppercase",
							margin: 0,
						}}
					>
						{eyebrow}
					</p>
				)}
				<h1
					style={{
						color: colors.foreground,
						fontSize: title.length > 30 ? 56 : title.length > 20 ? 64 : 72,
						fontWeight: 500,
						margin: 0,
						letterSpacing: "-0.03em",
						lineHeight: 1.1,
						maxWidth: 900,
					}}
				>
					{title}
				</h1>
				{description && (
					<p style={{ color: colors.mutedForeground, fontSize: 20, margin: 0, maxWidth: 560, lineHeight: 1.6 }}>
						{description}
					</p>
				)}
			</div>

			{/* Footer */}
			<div style={{ display: "flex", gap: 32 }}>
				{footer ? (
					<span style={{ color: colors.border, fontSize: 14 }}>{footer}</span>
				) : (
					techStack.map((tech) => (
						<span key={tech} style={{ color: colors.mutedForeground, fontSize: 14 }}>
							{tech}
						</span>
					))
				)}
			</div>
		</div>,
		{
			...SIZE,
			fonts: [{ name: "Geist", data: fontData, weight: 500 }],
		}
	)
}

async function save(response: ImageResponse, filePath: string) {
	const buffer = Buffer.from(await response.arrayBuffer())
	fs.mkdirSync(path.dirname(filePath), { recursive: true })
	fs.writeFileSync(filePath, buffer)
	console.log(`  ✓ ${path.relative(process.cwd(), filePath)}`)
}

async function generate() {
	console.log("\n Generating OG images...\n")

	const fontData = await fetch(
		"https://raw.githubusercontent.com/vercel/geist-font/refs/heads/main/packages/next/dist/fonts/geist-sans/Geist-Medium.ttf"
	).then((r) => {
		if (!r.ok) throw new Error(`Font fetch failed: ${r.status}`)
		return r.arrayBuffer()
	})

	await save(
		await ogImage({
			eyebrow: "Open source",
			title: "Reusable components, dependency-free.",
			description:
				"A personal collection of copy-paste ready UI primitives. Built with Next.js, TypeScript, and Tailwind CSS.",
			fontData,
		}),
		path.join(OUT_DIR, "index.png")
	)

	for (const component of components) {
		const slug = toKebabCase(component.title)
		const fileCount = component.codeBlocks.length - 1
		await save(
			await ogImage({
				eyebrow: component.tag,
				title: component.title,
				description: component.description,
				footer: `${fileCount} ${fileCount === 1 ? "file" : "files"}`,
				fontData,
			}),
			path.join(OUT_DIR, `${slug}.png`)
		)
	}

	console.log(`\n Done — ${1 + components.length} images saved to public/og/\n`)
}

generate().catch((err) => {
	console.error(err)
	process.exit(1)
})
