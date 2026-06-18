import { ComponentProps } from "react"

export interface SeekBarProps extends ComponentProps<"div"> {
	progress: number
	disabled?: boolean
}

export function SeekBar({ progress, disabled, className, ...props }: SeekBarProps) {
	return (
		<div className={`relative isolate h-3 flex-1 ${disabled ? "" : "cursor-pointer"} ${className || ""}`} {...props}>
			<div className="absolute top-1/2 -z-1 h-1 w-full -translate-y-1/2 rounded-full bg-neutral-800" />
			<div
				className="pointer-events-none absolute top-1/2 -z-1 h-1 -translate-y-1/2 rounded-full bg-neutral-400 transition-[width] duration-100"
				style={{ width: `${progress}%` }}
			/>
		</div>
	)
}
