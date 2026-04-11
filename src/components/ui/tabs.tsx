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
		<div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
			{children}
		</div>
	)
}

export function TabsTrigger({ children, isActive, onClick, className }: TabsTriggerProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
				isActive && "bg-background text-foreground shadow-sm",
				className
			)}
		>
			{children}
		</button>
	)
}

export function TabsContent({ children, isActive, className }: TabsContentProps) {
	if (!isActive) return null
	
	return (
		<div className={cn("mt-2 focus:outline-none", className)}>
			{children}
		</div>
	)
}
