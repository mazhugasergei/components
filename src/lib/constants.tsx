import { AnimatedButtonExample } from "@/components/examples/animated-button"
import { AudioRecorderExample } from "@/components/examples/audio-recorder"
import { ButtonExample } from "@/components/examples/button"
import { CommandExample } from "@/components/examples/command"
import { ExpandableExample } from "@/components/examples/expandable"
import { MediaPlayerExample } from "@/components/examples/media-player"
import Link from "next/link"
import type { Component } from "./types"

export const components: Component[] = [
	{
		title: "AnimatedButton",
		description: "Smooth width transitions when button content changes.",
		tag: "Animation",
		examples: [<AnimatedButtonExample />],
		codeBlocks: [
			{
				codeUrl: "hooks/use-measure.ts",
				filePath: "hooks/use-measure.ts",
			},
			{
				codeUrl: "components/ui/animated-button.tsx",
				filePath: "components/ui/animated-button.tsx",
			},
			{
				codeUrl: "components/examples/animated-button.tsx",
				filePath: "components/examples/animated-button.tsx",
			},
		],
	},
	{
		title: "AudioRecorder",
		description: "Audio recording component with playback and save capabilities.",
		tag: "Media",
		examples: [<AudioRecorderExample />],
		notice: (
			<>
				Also need <Link href="/button">Button</Link>.
			</>
		),
		codeBlocks: [
			{
				codeUrl: "components/ui/audio-recorder/index.tsx",
				filePath: "components/ui/audio-recorder/index.tsx",
			},
			{
				codeUrl: "components/ui/audio-recorder/screen.tsx",
				filePath: "components/ui/audio-recorder/screen.tsx",
			},
			{
				codeUrl: "components/ui/audio-recorder/download-button.tsx",
				filePath: "components/ui/audio-recorder/download-button.tsx",
			},
			{
				codeUrl: "components/ui/audio-recorder/icons.tsx",
				filePath: "components/ui/audio-recorder/icons.tsx",
			},
		],
	},
	{
		title: "Button",
		description: "Versatile button component with multiple variants and sizes.",
		tag: "Input",
		examples: [<ButtonExample />],
		codeBlocks: [
			{
				codeUrl: "components/ui/button.tsx",
				filePath: "components/ui/button.tsx",
			},
			{
				codeUrl: "components/examples/button.tsx",
				filePath: "components/examples/button.tsx",
			},
		],
	},
	{
		title: "Command",
		description: "Accessible command palette with keyboard navigation and search functionality.",
		tag: "Navigation",
		examples: [<CommandExample />],
		codeBlocks: [
			{
				codeUrl: "components/ui/command.tsx",
				filePath: "components/ui/command.tsx",
			},
			{
				codeUrl: "components/examples/command.tsx",
				filePath: "components/examples/command.tsx",
			},
		],
	},
	{
		title: "Expandable",
		description: "Smooth animations for expandable content.",
		tag: "Animation",
		examples: [<ExpandableExample />],
		codeBlocks: [
			{
				codeUrl: "hooks/use-measure.ts",
				filePath: "hooks/use-measure.ts",
			},
			{
				codeUrl: "components/ui/expandable.tsx",
				filePath: "components/ui/expandable.tsx",
			},
			{
				codeUrl: "components/examples/expandable.tsx",
				filePath: "components/examples/expandable.tsx",
			},
		],
	},
	{
		title: "MediaPlayer",
		description: "Media player component with playback controls and progress tracking.",
		tag: "Media",
		examples: [<MediaPlayerExample />],
		notice: (
			<>
				Also need <Link href="/button">Button</Link> and <Link href="/scroll-area">ScrollArea</Link>.
			</>
		),
		codeBlocks: [
			{
				codeUrl: "components/ui/media-player/index.tsx",
				filePath: "components/ui/media-player/index.tsx",
			},
			{
				codeUrl: "components/ui/media-player/screen.tsx",
				filePath: "components/ui/media-player/screen.tsx",
			},
			{
				codeUrl: "components/ui/media-player/playlist.tsx",
				filePath: "components/ui/media-player/playlist.tsx",
			},
			{
				codeUrl: "components/ui/media-player/icons.tsx",
				filePath: "components/ui/media-player/icons.tsx",
			},
			{
				codeUrl: "components/examples/media-player.tsx",
				filePath: "components/examples/media-player.tsx",
			},
		],
	},
]
