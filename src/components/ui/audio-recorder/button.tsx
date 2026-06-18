import React from "react"

const classes = {
	base: "flex items-center justify-center rounded-lg border transition-colors duration-150 hover:bg-neutral-800 disabled:opacity-30 disabled:bg-transparent",
	variant: {
		default: "border text-neutral-300 dark:border-neutral-700",
	},
	size: {
		default: "size-9",
	},
}

export type ButtonVariant = keyof typeof classes.variant
export type ButtonSize = keyof typeof classes.size
export interface ButtonProps extends React.ComponentProps<"button"> {
	variant?: ButtonVariant
	size?: ButtonSize
	className?: string
}

export function buttonVariants({
	variant = "default",
	size = "default",
	className,
}: Pick<ButtonProps, "variant" | "size" | "className"> | undefined = {}) {
	return [classes.base, classes.variant[variant], classes.size[size], className].filter(Boolean).join(" ")
}

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
	return (
		<button
			type="button"
			data-variant={variant}
			data-size={size}
			className={buttonVariants({ variant, size, className })}
			{...props}
		/>
	)
}
