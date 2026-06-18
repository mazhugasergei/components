import { ComponentProps } from "react"
import { formatTime } from "./utils"

export interface DurationProps extends ComponentProps<"span"> {
	time: number
}

export function Duration({ time, ...props }: DurationProps) {
	return (
		<span className="text-xs text-neutral-600 tabular-nums" {...props}>
			{formatTime(time)}
		</span>
	)
}
