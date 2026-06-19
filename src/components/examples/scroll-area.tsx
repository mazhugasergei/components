import { ScrollArea } from "@/components/ui/scroll-area"

const ITEMS = [
	"Cosmic Dreamer",
	"Neon Horizon",
	"Stellar Drift",
	"Phantom Circuit",
	"Echo Chamber",
	"Void Walker",
	"Pulse Engine",
	"Dark Matter",
	"Solar Flare",
	"Quantum Leap",
	"Binary Star",
	"Event Horizon",
	"Nebula Core",
	"Iron Signal",
	"Ghost Protocol",
	"Analog Decay",
	"Flux Capacitor",
	"Entropy Wave",
	"Zero Gravity",
	"Plasma Field",
	"Hyperion",
	"Cascade Loop",
	"Static Bloom",
	"Orbit Decay",
]

export function ScrollAreaExample() {
	return (
		<ScrollArea className="bg-background max-h-50 w-full max-w-50 rounded-lg border">
			<ul className="p-2">
				{ITEMS.map((name, i) => (
					<li key={i} className="px-2 py-1">
						<span className="text-muted-foreground text-sm">{name}</span>
					</li>
				))}
			</ul>
		</ScrollArea>
	)
}
