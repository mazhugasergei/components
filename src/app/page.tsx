"use client"

import { AnimatedHeightContainerExample } from "@/components/examples/animated-height-container"
import { AnimatedWidthContainerExample } from "@/components/examples/animated-width-container"
import { ComponentSection } from "@/components/ui/component-section"
import { PageHeader } from "@/components/ui/page-header"
import { ThemeSwitcher } from "../components/theme-switcher"

export default function Home() {
	return (
		<div className="mx-auto max-w-2xl space-y-12 p-8">
			<div className="flex items-center justify-between">
				<PageHeader
					title="Animation Containers"
					description="Examples of smooth dimension animations using React and Motion"
				/>
				<ThemeSwitcher />
			</div>

			<div className="space-y-8">
				<ComponentSection
					title="<AnimatedWidthContainer/>"
					description="Smooth width transitions when button content changes using custom useMeasure hook"
					technique="ResizeObserver API + Motion animation"
					badgeColor="blue"
				>
					<AnimatedWidthContainerExample />
				</ComponentSection>

				<ComponentSection
					title="<AnimatedHeightContainer/>"
					description="Smooth height animations for expandable content using AnimatePresence and ResizeObserver"
					technique="AnimatePresence + height measurement"
					badgeColor="green"
				>
					<AnimatedHeightContainerExample />
				</ComponentSection>
			</div>
		</div>
	)
}
