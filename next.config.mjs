import million from "million/compiler";

const getCorsHeaders = () => {
	const headers = {};

	headers["Access-Control-Allow-Origin"] = "*";
	headers["Access-Control-Allow-Credentials"] = "true";
	headers["Access-Control-Allow-Methods"] = "GET,OPTIONS,PATCH,DELETE,POST,PUT";
	headers["Access-Control-Allow-Headers"] =
		"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization";

	return Object.entries(headers).map(([key, value]) => ({ key, value }));
};

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["lucide-react"],
	swcMinify: true,
	distDir: "dist",
	headers: async () => {
		return [
			{
				source: "/api/(.*)",
				headers: getCorsHeaders()
			}
		];
	},
	experimental: {
		outputFileTracingIncludes: { "/": ["./node_modules/argon2/prebuilds/linux-x64/*.musl.*"] }
	}
};

const millionConfig = {
	auto: true,
	rsc: true
};

export default million.next(nextConfig, millionConfig);
