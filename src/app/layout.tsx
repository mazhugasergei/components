import "@/assets/styles/globals.css"
import { Aside } from "@/components/aside"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Components",
	description: "Personal collection of reusable components. Dependency-free. Copy-paste ready.",
	keywords: ["components", "react", "ui", "typescript", "next.js"],
	authors: [{ name: "Components" }],
	openGraph: {
		title: "Components",
		description: "Personal collection of reusable components. Dependency-free. Copy-paste ready.",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Components",
		description: "Personal collection of reusable components. Dependency-free. Copy-paste ready.",
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<div className="h-100dvh grid-cols-[auto_1fr] lg:grid">
						<Aside className="overflow-hidden max-lg:hidden" />
						<div className="flex min-w-0 flex-col overflow-hidden">{children}</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
