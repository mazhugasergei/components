"use client"

import {
	Command,
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
import { useEffect, useState } from "react"

export function CommandExample() {
	const [open, setOpen] = useState(false)
	const [isMac, setIsMac] = useState(false)

	useEffect(() => {
		setIsMac(navigator.platform.toLowerCase().includes("mac"))
	}, [])

	const shortcutKey = isMac ? "⌘K" : "Ctrl+K"
	const shortcuts = {
		calendar: isMac ? "⌘C" : "Ctrl+C",
		search: isMac ? "⌘E" : "Ctrl+E",
		calculator: isMac ? "⌘+⌘" : "Ctrl++",
		profile: isMac ? "⌘P" : "Ctrl+P",
		billing: isMac ? "⌘B" : "Ctrl+B",
		settings: isMac ? "⌘S" : "Ctrl+S",
	}

	return (
		<div className="grid place-items-center gap-4">
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandTrigger asChild>
					<button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 cursor-pointer rounded-md px-4 py-2 text-sm font-medium">
						Open
					</button>
				</CommandTrigger>

				<Command className="w-full">
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
				</Command>
			</CommandDialog>
		</div>
	)
}
