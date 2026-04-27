import { Header } from "@/components/component-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { components } from "@/lib/constants"
import { toKebabCase } from "@/utils/text"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
	return components.map((component) => ({
		slug: toKebabCase(component.title),
	}))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const component = components.find((item) => toKebabCase(item.title) === slug)
	if (!component) return notFound()

	return {
		title: component.title,
		description: component.description,
		openGraph: {
			images: [`/og/${slug}.png`],
		},
		twitter: {
			card: "summary_large_image",
			images: [`/og/${slug}.png`],
		},
	}
}

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const component = components.find((item) => toKebabCase(item.title) === slug)
	if (!component) return notFound()

	return (
		<ScrollArea>
			<Header title={component.title} backHref="/" className="lg:hidden" />
			{children}
		</ScrollArea>
	)
}
