import { AnimatedButtonExample } from "@/components/examples/animated-button"
import { ButtonExample } from "@/components/examples/button"
import { CommandExample } from "@/components/examples/command"
import { ExpandableExample } from "@/components/examples/expandable"
import type { Component } from "./types"

export const components: Component[] = [
	{
		title: "AnimatedButton",
		description: "Smooth width transitions when button content changes.",
		tag: "Animation",
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
		examples: [<AnimatedButtonExample />],
	},
	{
		title: "Button",
		description: "Versatile button component with multiple variants and sizes.",
		tag: "Input",
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
		examples: [<ButtonExample />],
	},
	{
		title: "Command",
		description: "Accessible command palette with keyboard navigation and search functionality.",
		tag: "Navigation",
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
		examples: [<CommandExample />],
	},
	{
		title: "Expandable",
		description: "Smooth animations for expandable content.",
		tag: "Animation",
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
		examples: [<ExpandableExample />],
	},
]
