import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	output: "export",
	basePath: "/components",
	assetPrefix: "/components",
	env: {
		NEXT_PUBLIC_BASE_PATH: "/components",
	},
}

export default nextConfig
