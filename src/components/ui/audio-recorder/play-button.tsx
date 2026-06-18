import { ComponentProps } from "react"
import { Button } from "./button"
import { PauseIcon, PlayIcon } from "./icons"

export interface PlayButtonProps extends ComponentProps<"button"> {
	isPlaying: boolean
}

export function PlayButton({ isPlaying, ...props }: PlayButtonProps) {
	return (
		<Button aria-label={isPlaying ? "Pause" : "Play"} {...props}>
			{isPlaying ? <PauseIcon /> : <PlayIcon />}
		</Button>
	)
}
