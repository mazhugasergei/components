"use client"

import { Expandable } from "@/components/ui/expandable"

export function ExpandableExample() {
	return (
		<Expandable
			expandedContent={
				<p className="mt-2 text-sm leading-relaxed">
					This technique uses CSS grid template rows to create smooth height animations. The grid transitions between
					states, allowing the content to naturally expand and collapse without JavaScript measurement.
				</p>
			}
		>
			<p className="text-sm leading-relaxed">
				Containers on the web snap to their new size instantly when content changes. By measuring the bounds of a
				container and animating to those values, we can make these transitions feel smooth and intentional.
			</p>
		</Expandable>
	)
}
