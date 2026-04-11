"use client"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { ComponentSection } from "@/components/ui/component-section"
import { PageHeader } from "@/components/ui/page-header"
import { components } from "@/lib/constants"

export default function Home() {
	return (
		<div className="mx-auto max-w-2xl space-y-12 p-8">
			<div className="flex items-center justify-between">
				<PageHeader
					title="Animated Components"
					description="Examples of smooth dimension animations using React and Motion"
				/>
				<ThemeSwitcher />
			</div>

			<div className="space-y-8">
				{components.map((component, index) => (
					<ComponentSection
						key={index}
						title={component.title}
						description={component.description}
						badgeColor={component.badgeColor}
						codeBlocks={component.codeBlocks}
					>
						{component.example}
					</ComponentSection>
				))}
			</div>
		</div>
	)
}
