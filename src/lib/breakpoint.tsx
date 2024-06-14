"use client";

import { useEffect, useState } from "react";

const tailwindConfig = {
	xs: 475,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1400
};

const getBreakpoint = (width: number) => {
	if (width >= tailwindConfig["2xl"]) return "2xl";
	if (width >= tailwindConfig.xl) return "xl";
	if (width >= tailwindConfig.lg) return "lg";
	if (width >= tailwindConfig.md) return "md";
	if (width >= tailwindConfig.sm) return "sm";
	return "xs";
};

export const useBreakpoint = () => {
	const [mounted, setMounted] = useState(false);
	const [breakpoint, setBreakpoint] = useState<string>();

	useEffect(() => {
		setMounted(true);
		if (!mounted) return;
		const handleResize = () => {
			setBreakpoint(getBreakpoint(window.innerWidth));
		};

		// Verificar si window está definido antes de usarlo
		if (typeof window !== "undefined") {
			window.addEventListener("resize", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}
	}, [mounted]); // Remover window.innerWidth de las dependencias

	return breakpoint;
};
