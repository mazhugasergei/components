import { Button } from "@/components/ui/button"
import { ComponentProps } from "react"
import { PauseIcon, PlayIcon } from "./icons"

export interface PlayButtonProps extends ComponentProps<"button"> {
	isPlaying: boolean
}

export function PlayButton({ isPlaying, ...props }: PlayButtonProps) {
	return (
		<Button variant="outline" size="icon" aria-label={isPlaying ? "Pause" : "Play"} {...props}>
			{isPlaying ? <PauseIcon /> : <PlayIcon />}
		</Button>
	)
}
