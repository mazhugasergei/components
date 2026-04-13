import { AnimatedButtonExample } from "@/components/examples/animated-button"
import { ExpandableExample } from "@/components/examples/expandable"

export const components = [
	{
		title: "AnimatedButton",
		description: "Smooth width transitions when button content changes using custom useMeasure hook.",
		badgeColor: "blue" as const,
		codeBlocks: [
			{
				title: "Installation",
				code: "npm install motion",
			},
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
		description: "Smooth height animations for expandable content using AnimatePresence and ResizeObserver.",
		badgeColor: "green" as const,
		codeBlocks: [
			{
				title: "Installation",
				code: "npm install motion",
			},
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
]
