import { Button } from "@/components/ui/button"
import { ComponentProps } from "react"
import { RecordIcon } from "./icons"

export interface RecordButtonProps extends ComponentProps<"button"> {
	isRecording: boolean
}

export function RecordButton({ isRecording, ...props }: RecordButtonProps) {
	return (
		<Button
			aria-label={isRecording ? "Stop recording" : "Start recording"}
			variant="outline"
			size="icon"
			className={`${isRecording ? "border-red-400! bg-red-400/5! text-red-400! hover:bg-red-400/10!" : ""}`}
			{...props}
		>
			<RecordIcon isRecording={isRecording} className={isRecording ? "animate-pulse" : ""} />
		</Button>
	)
}
