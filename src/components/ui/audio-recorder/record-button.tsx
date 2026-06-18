import { ComponentProps } from "react"
import { Button } from "./button"
import { RecordIcon } from "./icons"

export interface RecordButtonProps extends ComponentProps<"button"> {
	isRecording: boolean
}

export function RecordButton({ isRecording, ...props }: RecordButtonProps) {
	return (
		<Button
			className={`${isRecording ? "border-red-400! bg-red-400/5! text-red-400! hover:bg-red-400/10!" : ""}`}
			{...props}
		>
			<RecordIcon isRecording={isRecording} className={isRecording ? "animate-pulse" : ""} />
		</Button>
	)
}
