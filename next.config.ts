import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	basePath: "/components",
	assetPrefix: "/components",
	output: "export",
}

export default nextConfig
