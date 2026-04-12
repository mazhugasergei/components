"use client"

import { cn } from "@/utils/classname"

interface TabsProps {
	children: React.ReactNode
	className?: string
}

interface TabsListProps {
	children: React.ReactNode
	className?: string
}

interface TabsTriggerProps {
	children: React.ReactNode
	isActive: boolean
	onClick: () => void
	className?: string
}

interface TabsContentProps {
	children: React.ReactNode
	isActive: boolean
	className?: string
}

export function Tabs({ children, className }: TabsProps) {
	return <div className={cn("w-full", className)}>{children}</div>
}

export function TabsList({ children, className }: TabsListProps) {
	return (
		<div
			className={cn(
				"bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1",
				className
			)}
		>
			{children}
		</div>
	)
}

export function TabsTrigger({ children, isActive, onClick, className }: TabsTriggerProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
				isActive && "bg-background text-foreground shadow-sm",
				className
			)}
		>
			{children}
		</button>
	)
}

export function TabsContent({ children, isActive, className }: TabsContentProps) {
	return <div className={cn("mt-2 focus:outline-none", !isActive && "hidden", className)}>{children}</div>
}
