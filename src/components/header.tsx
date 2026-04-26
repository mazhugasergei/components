export function Header() {
	return (
		<header className="backdrop-blur-safe sticky top-0">
			<div className="mx-auto flex max-w-3xl items-center justify-between px-8 py-4">
				<span className="text-foreground font-medium">components</span>
				<div className="flex items-center gap-8">
					<a
						href="https://github.com/mazhugasergei/components"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
					>
						GitHub
					</a>
				</div>
			</div>
		</header>
	)
}
