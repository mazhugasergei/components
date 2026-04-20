import { AnimatedButtonExample } from "@/components/examples/animated-button"
import { CommandExample } from "@/components/examples/command"
import { ExpandableExample } from "@/components/examples/expandable"
import type { Component } from "./types"

export const components: Component[] = [
	{
		title: "AnimatedButton",
		description: "Smooth width transitions when button content changes.",
		codeBlocks: [
			{
				title: "Hook",
				codeUrl: "hooks/use-measure.ts",
				filePath: "hooks/use-measure.ts",
			},
			{
				title: "Component",
				codeUrl: "components/ui/animated-button.tsx",
				filePath: "components/ui/animated-button.tsx",
			},
			{
				title: "Usage",
				codeUrl: "components/examples/animated-button.tsx",
				filePath: "components/examples/animated-button.tsx",
			},
		],
		examples: [<AnimatedButtonExample />],
	},
	{
		title: "Expandable",
		description: "Smooth animations for expandable content.",
		codeBlocks: [
			{
				title: "Hook",
				codeUrl: "hooks/use-measure.ts",
				filePath: "hooks/use-measure.ts",
			},
			{
				title: "Component",
				codeUrl: "components/ui/expandable.tsx",
				filePath: "components/ui/expandable.tsx",
			},
			{
				title: "Usage",
				codeUrl: "components/examples/expandable.tsx",
				filePath: "components/examples/expandable.tsx",
			},
		],
		examples: [<ExpandableExample />],
	},
	{
		title: "Command",
		description: "Accessible command palette with keyboard navigation and search functionality.",
		codeBlocks: [
			// {
			// 	title: "Component",
			// 	codeUrl: "components/ui/command.tsx",
			// 	filePath: "components/ui/command.tsx",
			// },
			// {
			// 	title: "Usage",
			// 	codeUrl: "components/examples/command.tsx",
			// 	filePath: "components/examples/command.tsx",
			// },
		],
		examples: [<CommandExample />],
	},
]
