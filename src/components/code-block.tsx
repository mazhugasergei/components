"use client"

import { useEffect, useState } from "react"

interface CodeBlockProps {
	title: string
	code?: string
	codeUrl?: string
	filePath?: string
}

export function CodeBlock({ title, code, codeUrl, filePath }: CodeBlockProps) {
	const [fetchedCode, setFetchedCode] = useState<string>(code || "")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string>("")

	useEffect(() => {
		if (codeUrl && !code) {
			setLoading(true)
			setError("")

			fetch(`https://raw.githubusercontent.com/mazhugasergei/components/refs/heads/main/${codeUrl}`)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to fetch: ${response.statusText}`)
					}
					return response.text()
				})
				.then((text) => {
					setFetchedCode(text)
				})
				.catch((err) => {
					setError(err.message || "Failed to load code")
					console.error("Error fetching code:", err)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [codeUrl, code])

	if (loading) {
		return (
			<div>
				<h3>{title}</h3>
				<div>Loading code from GitHub...</div>
			</div>
		)
	}

	if (error) {
		return (
			<div>
				<h3>{title}</h3>
				<div>Error loading code: {error}</div>
			</div>
		)
	}

	return (
		<div>
			<h3>{title}</h3>
			{filePath && <div className="mb-2 text-sm text-gray-500">{filePath}</div>}
			<pre className="overflow-x-auto rounded-md bg-gray-100 p-4">
				<code>{fetchedCode}</code>
			</pre>
		</div>
	)
}
