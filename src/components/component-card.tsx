import { preventOrphan } from "@/utils/text"
import { ChevronRightIcon, DotIcon } from "lucide-react"
import Link from "next/link"

interface Props extends React.ComponentProps<typeof Link> {
	title: string
	description: string
	codeBlocksCount: number
}

export function ComponentCard({ href, title, description, codeBlocksCount, ...props }: Props) {
	return (
		<Link
			href={href}
			className="group bg-card/50 relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
			{...props}
		>
			<div className="relative flex h-full flex-col justify-between p-8">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-3">
						<h2 className="text-foreground group-hover:text-primary font-mono text-xl font-semibold transition-colors">
							{title}
						</h2>
						<p className="text-muted-foreground leading-relaxed">{preventOrphan(description)}</p>
					</div>
					<ChevronRightIcon className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-all duration-300 group-hover:translate-x-1" />
				</div>

				<div className="text-muted-foreground mt-6 flex items-center gap-2 text-xs">
					<span className="font-mono">
						{codeBlocksCount} file{codeBlocksCount !== 1 ? "s" : ""}
					</span>
					<DotIcon className="-mx-1 h-3 w-3" />
					<span className="flex items-center gap-1">
						View documentation <ChevronRightIcon className="mt-0.5 h-3 w-3" />
					</span>
				</div>
			</div>
		</Link>
	)
}
