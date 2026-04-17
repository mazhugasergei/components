"use client"

import { Expandable } from "@/components/ui/expandable"

export function ExpandableExample() {
	return (
		<Expandable
			expandedContent={
				<p className="text-sm leading-relaxed">
					This technique uses a ref to track the height of the inner content. When the content changes, the measured
					height updates and the outer container animates to match.
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
