import { AnimatedWidthContainerExample } from "@/components/examples/animated-width-container"
import { Expandable } from "@/components/examples/expandable"

export const components = [
	{
		title: "<AnimatedWidthContainer/>",
		description: "Smooth width transitions when button content changes using custom useMeasure hook",
		badgeColor: "blue" as const,
		codeBlocks: [
			{
				title: "Installation",
				code: "npm install motion/react",
			},
			{
				title: "Hook",
				codeUrl: "hooks/use-measure.ts",
			},
			{
				title: "Component",
				codeUrl: "components/ui/animated-width-container.tsx",
			},
			{
				title: "Usage",
				codeUrl: "components/examples/animated-width-container.tsx",
			},
		],
		example: <AnimatedWidthContainerExample />,
	},
	{
		title: "<Expandable/>",
		description: "Smooth height animations for expandable content using AnimatePresence and ResizeObserver",
		badgeColor: "green" as const,
		codeBlocks: [
			{
				title: "Installation",
				code: "npm install motion/react",
			},
			{
				title: "Component",
				codeUrl: "components/ui/animated-height-container.tsx",
			},
			{
				title: "Usage",
				codeUrl: "components/examples/animated-height-container.tsx",
			},
		],
		example: <Expandable />,
	},
]
