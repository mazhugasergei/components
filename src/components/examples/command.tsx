"use client"

import {
	CommandBody,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	CommandTrigger,
} from "@/components/ui/command"
import React from "react"

export function CommandExample() {
	const [isMac, setIsMac] = React.useState(false)

	React.useEffect(() => {
		setIsMac(navigator.userAgent.toLowerCase().includes("mac"))
	}, [])

	const shortcutKey = isMac ? "⌘K" : "Ctrl + K"
	const shortcuts = {
		calendar: isMac ? "⌘C" : "Ctrl + C",
		search: isMac ? "⌘E" : "Ctrl + E",
		calculator: isMac ? "⌘ + ⌘" : "Ctrl + +",
		profile: isMac ? "⌘P" : "Ctrl + P",
		billing: isMac ? "⌘B" : "Ctrl + B",
		settings: isMac ? "⌘S" : "Ctrl + S",
	}

	return (
		<div className="grid place-items-center gap-4">
			<CommandDialog>
				<CommandTrigger asChild>
					<button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 cursor-pointer rounded-md px-4 py-2 text-sm font-medium">
						Open{" "}
						<span className="text-muted-foreground text-xs">
							<span className="relative bottom-0.25">|</span> {shortcutKey}
						</span>
					</button>
				</CommandTrigger>

				<CommandBody>
					<CommandInput placeholder="Type a command or search..." />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>

						<CommandGroup heading="Suggestions">
							<CommandItem value="calendar">
								Calendar
								<CommandShortcut>{shortcuts.calendar}</CommandShortcut>
							</CommandItem>
							<CommandItem value="search-emoji">
								Search Emoji
								<CommandShortcut>{shortcuts.search}</CommandShortcut>
							</CommandItem>
							<CommandItem value="calculator">
								Calculator
								<CommandShortcut>{shortcuts.calculator}</CommandShortcut>
							</CommandItem>
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading="Settings">
							<CommandItem value="profile">
								Profile
								<CommandShortcut>{shortcuts.profile}</CommandShortcut>
							</CommandItem>
							<CommandItem value="billing">
								Billing
								<CommandShortcut>{shortcuts.billing}</CommandShortcut>
							</CommandItem>
							<CommandItem value="settings">
								Settings
								<CommandShortcut>{shortcuts.settings}</CommandShortcut>
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</CommandBody>
			</CommandDialog>
		</div>
	)
}
