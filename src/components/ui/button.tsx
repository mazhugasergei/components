import { ComponentProps } from "react"

const classes = {
	base: "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	variant: {
		default: "bg-primary text-primary-foreground hover:bg-primary/90",
		destructive:
			"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
		outline: "border shadow-xs hover:text-accent-foreground hover:bg-accent dark:border-input dark:hover:bg-input/50",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
		link: "text-primary underline-offset-4 hover:underline",
		transparent: "text-muted-foreground hover:text-foreground",
	},
	size: {
		default: "h-9 px-4 py-2",
		lg: "h-10 px-6",
		sm: "h-8 gap-1.5! px-3",
		xs: "h-6 gap-1.5! px-2 text-xs [&_svg:not([class*='size-'])]:size-3!",
		icon: "size-9",
		"icon-lg": "size-10 gap-1.5!",
		"icon-sm": "size-8 gap-1.5!",
		"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3! gap-1!",
	},
}

export type ButtonVariant = keyof typeof classes.variant
export type ButtonSize = keyof typeof classes.size
export interface ButtonProps extends ComponentProps<"button"> {
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
