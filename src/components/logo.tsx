import Link from "next/link"

export function Logo() {
	return <span className="text-foreground font-medium">components</span>
}

export function LogoLink({ ...props }: Omit<React.ComponentProps<typeof Link>, "href">) {
	return (
		<Link href="/" {...props}>
			<Logo />
		</Link>
	)
}
