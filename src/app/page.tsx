"use client"

import { AnimatedHeightContainer } from "@/components/examples/animated-height-container"
import { AnimatedWidthContainer } from "@/components/examples/animated-width-container"
import { ComponentSection } from "@/components/ui/component-section"
import { PageHeader } from "@/components/ui/page-header"
import { Paragraph } from "@/components/ui/paragraph"
import { motion } from "motion/react"
import { useState } from "react"
import { ThemeSwitcher } from "../components/theme-switcher"

export default function Home() {
	const [widthIndex, setWidthIndex] = useState(0)
	const labels = ["Lorem Ipsum", "Ex Amet", "Aliqua Velit"]

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
					<AnimatedWidthContainer onClick={() => setWidthIndex((prev) => (prev + 1) % labels.length)}>
						{labels[widthIndex]}
					</AnimatedWidthContainer>
				</ComponentSection>

				<ComponentSection
					title="<AnimatedHeightContainer/>"
					description="Smooth height animations for expandable content using AnimatePresence and ResizeObserver"
					technique="AnimatePresence + height measurement"
					badgeColor="green"
				>
					<AnimatedHeightContainer
						expandedContent={
							<motion.div
								initial={{ opacity: 0, filter: "blur(8px)" }}
								animate={{ opacity: 1, filter: "blur(0px)" }}
								exit={{ opacity: 0, filter: "blur(8px)" }}
							>
								<Paragraph>
									This technique uses a ref to track the height of the inner content. When the content changes, the
									measured height updates and Motion animates the outer container to match. The inner div always has its
									natural height, so the content is never clipped or distorted.
								</Paragraph>
							</motion.div>
						}
					>
						<Paragraph>
							Containers on the web snap to their new size instantly when content changes. By measuring the bounds of a
							container and animating to those values, we can make these transitions feel smooth and intentional.
						</Paragraph>
					</AnimatedHeightContainer>
				</ComponentSection>
			</div>
		</div>
	)
}
