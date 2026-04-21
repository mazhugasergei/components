"use client"

import { Button, ButtonProps } from "@/components/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle(props: ButtonProps) {
	const { setTheme, theme } = useTheme()

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light")
	}

	return (
		<Button variant="ghost" size="icon-sm" onClick={toggleTheme} aria-label="Toggle theme" {...props}>
			<SunIcon className="fill-foreground text-foreground h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<MoonIcon className="fill-foreground text-foreground absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
		</Button>
	)
}
