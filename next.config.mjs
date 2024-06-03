import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["lucide-react"],
	swcMinify: true,
	distDir: "dist"
};

const millionConfig = {
	auto: true,
	rsc: true
};

export default million.next(nextConfig, millionConfig);
