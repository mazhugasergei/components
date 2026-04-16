import "@/assets/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Aside } from "@/components/ui/aside"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Components",
	description: "Animated components with smooth dimension animations",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<div className="min-h-100dvh grid-cols-[15rem_1fr] lg:grid">
						<Aside backHref="~" className="max-lg:hidden" />
						<div className="min-w-0">{children}</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
