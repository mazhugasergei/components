import React, {
	Children,
	createContext,
	isValidElement,
	KeyboardEvent,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import { createPortal } from "react-dom"

// Inject animation styles
const animationStyles = `
@keyframes fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes scale-in {
	from { opacity: 0; transform: scale(0.97); }
	to { opacity: 1; transform: scale(1); }
}

@keyframes fade-out {
	from { opacity: 1; }
	to { opacity: 0; }
}

@keyframes scale-out {
	from { opacity: 1; transform: scale(1); }
	to { opacity: 0; transform: scale(0.97); }
}

.animate-in {
	animation-duration: 200ms;
	animation-fill-mode: both;
}

.fade-in-0 {
	animation-name: fade-in;
}

.scale-in {
	animation-name: scale-in;
}

.animate-out {
	animation-duration: 150ms;
	animation-fill-mode: both;
}

.fade-out-0 {
	animation-name: fade-out;
}

.scale-out {
	animation-name: scale-out;
}
`

let stylesInjected = false
const injectStyles = () => {
	if (!stylesInjected && typeof document !== "undefined") {
		const styleEl = document.createElement("style")
		styleEl.textContent = animationStyles
		document.head.appendChild(styleEl)
		stylesInjected = true
	}
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CommandContextType {
	query: string
	setQuery: (query: string) => void
	activeIndex: number
	setActiveIndex: (index: number) => void
	registerItem: (value: string, el: HTMLElement | null) => () => void
	visibleItems: Array<{ value: string; el: HTMLElement | null }>
	onSelect?: (value: string) => void
	handleKeyDown: (e: KeyboardEvent) => void
}

interface DialogContextType {
	open: boolean
	setOpen: (open: boolean) => void
}

const CommandContext = createContext<CommandContextType | null>(null)
const useCommand = () => useContext(CommandContext)

const DialogContext = createContext<DialogContextType | null>(null)
export const useCommandDialog = () => useContext(DialogContext)

// ---------------------------------------------------------------------------
// CommandDialog — modal wrapper with backdrop + cmd+k / ctrl+k hotkey
// ---------------------------------------------------------------------------

export function CommandDialog({
	children,
	open: controlledOpen,
	onOpenChange,
	className = "",
}: {
	children: React.ReactNode
	open?: boolean
	onOpenChange?: (open: boolean) => void
	className?: string
}) {
	const isControlled = controlledOpen !== undefined
	const [internalOpen, setInternalOpen] = useState(false)
	const [isClosing, setIsClosing] = useState(false)
	const open = isControlled ? controlledOpen : internalOpen
	const shouldShow = open || isClosing

	// Inject animation styles on component mount
	useEffect(() => {
		injectStyles()
	}, [])

	const setOpen = useCallback(
		(val: boolean | ((prev: boolean) => boolean)) => {
			const newValue = typeof val === "function" ? val(open) : val
			if (!newValue && open) {
				setIsClosing(true)
			}
			if (!isControlled) setInternalOpen(newValue)
			onOpenChange?.(newValue)
		},
		[isControlled, onOpenChange, open]
	)

	// global cmd+k / ctrl+k
	useEffect(() => {
		const handler = (e: globalThis.KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((prev) => !prev)
			}
		}
		document.addEventListener("keydown", handler)
		return () => document.removeEventListener("keydown", handler)
	}, [setOpen])

	// Escape closes
	useEffect(() => {
		if (!open) return
		const handler = (e: globalThis.KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false)
		}
		document.addEventListener("keydown", handler)
		return () => document.removeEventListener("keydown", handler)
	}, [open, setOpen])

	// separate trigger children (rendered always) from dialog children
	const triggerChildren = Children.toArray(children).filter((c) => isValidElement(c) && c.type === CommandTrigger)
	const dialogChildren = Children.toArray(children).filter((c) => !(isValidElement(c) && c.type === CommandTrigger))

	const ctx = { open, setOpen }

	const modal = shouldShow
		? createPortal(
				<div
					className={`fixed inset-0 z-50 flex items-start justify-center pt-[20vh] backdrop-blur-sm ${
						open ? "animate-in fade-in-0 scale-in duration-200" : "animate-out fade-out-0 scale-out duration-150"
					}`}
					aria-modal="true"
					role="dialog"
					aria-label="Command palette"
					onAnimationEnd={() => {
						if (!open) {
							setIsClosing(false)
						}
					}}
				>
					{/* backdrop */}
					<div
						className={`bg-background/80 absolute inset-0 backdrop-blur-sm ${
							open ? "animate-in fade-in-0 duration-200" : "animate-out fade-out-0 duration-150"
						}`}
						onClick={() => setOpen(false)}
					/>
					{/* panel */}
					<div
						className={`relative z-10 w-full max-w-lg ${
							open ? "animate-in fade-in-0 scale-in duration-200" : "animate-out fade-out-0 scale-out duration-150"
						} ${className}`}
						onClick={(e) => e.stopPropagation()}
					>
						{dialogChildren}
					</div>
				</div>,
				document.body
			)
		: null

	return (
		<DialogContext.Provider value={ctx}>
			{triggerChildren}
			{modal}
		</DialogContext.Provider>
	)
}

// ---------------------------------------------------------------------------
// CommandTrigger — wraps any children; opens dialog on click
// ---------------------------------------------------------------------------

export function CommandTrigger({
	children,
	className = "",
	asChild = false,
}: {
	children: React.ReactNode
	className?: string
	asChild?: boolean
}) {
	const ctx = useContext(DialogContext)

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		ctx?.setOpen(true)
	}

	if (asChild && isValidElement(children)) {
		const childElement = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
		const original = childElement.props.onClick
		return React.cloneElement(childElement, {
			onClick: (e: React.MouseEvent) => {
				original?.(e)
				handleClick(e)
			},
		})
	}

	return (
		<button type="button" onClick={handleClick} className={className} aria-label="Open command palette">
			{children}
		</button>
	)
}

// ---------------------------------------------------------------------------
// Command — inner palette widget (no modal chrome)
// ---------------------------------------------------------------------------

export function Command({
	children,
	className = "",
	onSelect,
	...props
}: {
	children: React.ReactNode
	className?: string
	onSelect?: (value: string) => void
	[key: string]: unknown
}) {
	const [query, setQuery] = useState("")
	const [activeIndex, setActiveIndex] = useState(-1)
	const [items, setItems] = useState<Array<{ value: string; el: HTMLElement | null }>>([])

	const registerItem = useCallback((value: string, el: HTMLElement | null) => {
		setItems((prev) => {
			if (el && !prev.find((i) => i.value === value)) {
				return [...prev, { value, el }]
			}
			return prev
		})
		return () => {
			setItems((prev) => prev.filter((i) => i.value !== value))
		}
	}, [])

	const visibleItems = useMemo(() => {
		if (!query) return items
		return items.filter((i) => i.value.toLowerCase().includes(query.toLowerCase()))
	}, [query, items])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowDown") {
				e.preventDefault()
				setActiveIndex((prev) => (prev < visibleItems.length - 1 ? prev + 1 : 0))
			} else if (e.key === "ArrowUp") {
				e.preventDefault()
				setActiveIndex((prev) => (prev > 0 ? prev - 1 : visibleItems.length - 1))
			} else if (e.key === "Enter") {
				e.preventDefault()
				const item = visibleItems[activeIndex]
				if (item) onSelect?.(item.value)
			}
		},
		[visibleItems, activeIndex, onSelect]
	)

	return (
		<CommandContext.Provider
			value={{
				query,
				setQuery,
				activeIndex,
				setActiveIndex,
				registerItem,
				visibleItems,
				onSelect,
				handleKeyDown,
			}}
		>
			<div
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded="true"
				onKeyDown={handleKeyDown}
				className={`bg-background overflow-hidden rounded-lg border ${className}`}
				{...props}
			>
				{children}
				<CommandFooter />
			</div>
		</CommandContext.Provider>
	)
}

// ---------------------------------------------------------------------------
// CommandInput
// ---------------------------------------------------------------------------

export function CommandInput({
	placeholder = "",
	className = "",
	...props
}: {
	placeholder?: string
	className?: string
	[key: string]: unknown
}) {
	const ctx = useCommand()
	if (!ctx) return null
	const { query, setQuery, setActiveIndex } = ctx
	const inputRef = useRef<HTMLInputElement>(null)

	// auto-focus when mounted inside the dialog
	useEffect(() => {
		const t = setTimeout(() => inputRef.current?.focus(), 0)
		return () => clearTimeout(t)
	}, [])

	return (
		<div className="flex items-center gap-2 border-b px-3">
			<svg
				className="text-muted-foreground h-4 w-4 shrink-0"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
			<input
				ref={inputRef}
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
				role="combobox"
				aria-autocomplete="list"
				placeholder={placeholder}
				value={query}
				onChange={(e) => {
					setQuery(e.target.value)
					setActiveIndex(-1)
				}}
				className={`text-foreground placeholder:text-muted-foreground flex h-11 w-full bg-transparent py-3 text-sm focus:outline-none ${className}`}
				{...props}
			/>
		</div>
	)
}

// ---------------------------------------------------------------------------
// CommandList
// ---------------------------------------------------------------------------

export function CommandList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return (
		<div role="listbox" className={`custom-scrollbar max-h-100 overflow-x-hidden overflow-y-auto ${className}`}>
			{children}
		</div>
	)
}

// ---------------------------------------------------------------------------
// CommandEmpty
// ---------------------------------------------------------------------------

export function CommandEmpty({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	const ctx = useCommand()
	if (!ctx) return null
	const { visibleItems } = ctx
	if (visibleItems.length > 0) return null
	return (
		<div className={`text-muted-foreground py-6 text-center text-sm ${className}`} role="presentation">
			{children}
		</div>
	)
}

// ---------------------------------------------------------------------------
// CommandGroup
// ---------------------------------------------------------------------------

export function CommandGroup({
	heading,
	children,
	className = "",
}: {
	heading?: string
	children: React.ReactNode
	className?: string
}) {
	const ctx = useCommand()
	if (!ctx) return null
	const { query } = ctx

	const values = useMemo(() => {
		const vals: string[] = []
		Children.forEach(children, (child) => {
			if (!isValidElement(child)) return
			const childProps = child.props as { value?: string; children?: React.ReactNode }
			if (childProps.value != null) vals.push(String(childProps.value))
			else if (typeof childProps.children === "string") vals.push(childProps.children)
		})
		return vals
	}, [children])

	const hasVisible = useMemo(() => {
		if (!query) return true
		return values.some((v) => v.toLowerCase().includes(query.toLowerCase()))
	}, [query, values])

	if (!hasVisible) return null

	return (
		<div role="group" aria-label={heading} className={`space-y-1 overflow-hidden p-2 ${className}`}>
			{heading && <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">{heading}</div>}
			{children}
		</div>
	)
}

// ---------------------------------------------------------------------------
// CommandSeparator
// ---------------------------------------------------------------------------

export function CommandSeparator({ className = "" }: { className?: string }) {
	const ctx = useCommand()
	if (!ctx) return null
	const { visibleItems } = ctx
	if (visibleItems.length === 0) return null
	return <hr className={`bg-border -mx-1 h-px border-0 ${className}`} />
}

// ---------------------------------------------------------------------------
// CommandItem
// ---------------------------------------------------------------------------

export function CommandItem({
	children,
	value,
	onSelect,
	disabled = false,
	className = "",
	...props
}: {
	children: React.ReactNode
	value?: string
	onSelect?: (value: string) => void
	disabled?: boolean
	className?: string
	[key: string]: unknown
}) {
	const ctx = useCommand()
	if (!ctx) return null
	const resolvedValue = value ?? (typeof children === "string" ? children : "")
	const elRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		return ctx.registerItem(resolvedValue, elRef.current)
	}, [resolvedValue])

	const { query, visibleItems, activeIndex, setActiveIndex, onSelect: ctxSelect } = ctx

	const visible = !query || resolvedValue.toLowerCase().includes(query.toLowerCase())
	if (!visible) return null

	const myIndex = visibleItems.findIndex((i) => i.value === resolvedValue)
	const isActive = myIndex !== -1 && myIndex === activeIndex

	return (
		<div
			ref={elRef}
			role="option"
			aria-selected={isActive}
			aria-disabled={disabled}
			className={[
				"relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors outline-none select-none",
				isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent",
				disabled ? "pointer-events-none opacity-40" : "",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			onMouseEnter={() => !disabled && setActiveIndex(myIndex)}
			onMouseLeave={() => setActiveIndex(-1)}
			onClick={() => {
				if (disabled) return
				onSelect?.(resolvedValue)
				ctxSelect?.(resolvedValue)
			}}
			{...props}
		>
			{children}
		</div>
	)
}

// ---------------------------------------------------------------------------
// CommandShortcut — right-aligned kbd hint inside a CommandItem
// ---------------------------------------------------------------------------

export function CommandShortcut({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return <span className={`text-muted-foreground ml-auto text-xs tracking-widest ${className}`}>{children}</span>
}

// ---------------------------------------------------------------------------
// CommandFooter
// ---------------------------------------------------------------------------

export function CommandFooter({ className = "" }: { className?: string }) {
	const [isMac, setIsMac] = useState(false)

	useEffect(() => {
		setIsMac(navigator.platform.toLowerCase().includes("mac"))
	}, [])

	const shortcuts = isMac
		? [
				{ keys: ["↑", "↓"], description: "Navigate" },
				{ keys: ["Enter"], description: "Select" },
				{ keys: ["Esc"], description: "Close" },
			]
		: [
				{ keys: ["↑", "↓"], description: "Navigate" },
				{ keys: ["Enter"], description: "Select" },
				{ keys: ["Esc"], description: "Close" },
			]

	return (
		<div className={`border-t px-3 py-2 ${className}`}>
			<div className="text-muted-foreground flex gap-5 text-xs">
				{shortcuts.map((shortcut, index) => (
					<div key={index} className="flex items-center gap-2">
						<span>{shortcut.description}</span>
						<span className="flex items-center gap-1">
							{shortcut.keys.map((key, keyIndex) => (
								<span
									key={keyIndex}
									className="grid min-h-6 min-w-6 place-items-center rounded-md border px-2 py-1 font-medium select-none"
								>
									{key}
								</span>
							))}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
