import { ThemeLoader } from "@/components/theme-loader"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: "Components",
	description: "Animated components with smooth dimension animations",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<ThemeLoader />
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
