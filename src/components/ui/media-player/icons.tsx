import { ComponentProps } from "react"

const DEFAULT_ICON_SIZE = 14

export interface IconProps extends ComponentProps<"svg"> {
	size?: number
}

export function PlayIcon({ size = DEFAULT_ICON_SIZE, ...props }: IconProps) {
	// proportions match the original 14px path (left=3, top=2.5, dx=9, dy=4.5)
	const left = (size * 3) / 14
	const top = (size * 2.5) / 14
	const dx = (size * 9) / 14
	const dy = (size * 4.5) / 14

	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="currentColor" {...props}>
			<path d={`M${left} ${top}l${dx} ${dy}-${dx} ${dy}V${top}z`} />
		</svg>
	)
}

export function PauseIcon({ size = DEFAULT_ICON_SIZE, ...props }: IconProps) {
	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="currentColor" {...props}>
			<rect x={size / 7} y={size / 7} width={size / 3.5} height={size - (size / 7) * 2} rx={size / 14} />
			<rect
				x={size - size / 7 - size / 3.5}
				y={size / 7}
				width={size / 3.5}
				height={size - (size / 7) * 2}
				rx={size / 14}
			/>
		</svg>
	)
}
