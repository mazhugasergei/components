"use client"

import { useStore } from "@/lib/store"
import { useEffect } from "react"

const THEME_URL = "https://raw.githubusercontent.com/mazhugasergei/theme-builder/refs/heads/main/themes/theme.json"

export function ThemeLoader() {
	const { setCodeBlockTheme } = useStore()

	useEffect(() => {
		const loadTheme = async () => {
			try {
				const res = await fetch(THEME_URL)
				if (!res.ok) throw new Error("Failed to fetch theme")
				const theme = await res.json()
				setCodeBlockTheme(theme)
			} catch (err) {
				console.error("Error loading theme:", err)
			}
		}

		loadTheme()
	}, [setCodeBlockTheme])

	return null
}
