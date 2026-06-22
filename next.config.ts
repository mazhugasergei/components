import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	skipTrailingSlashRedirect: true,
	images: { unoptimized: true },
	basePath: "/components",
}

export default nextConfig
