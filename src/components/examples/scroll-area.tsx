import { ScrollArea } from "@/components/ui/scroll-area"

export function ScrollAreaExample() {
	return (
		<ScrollArea className="max-h-50">
			<ul>
				{Array.from({ length: 50 }).map((_, i) => (
					<li key={i}>Item {i + 1}</li>
				))}
			</ul>
		</ScrollArea>
	)
}
