import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TailwindIndicator } from "@/components/ui/tailwindcss-indicator";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Botillería La Tía",
	description: "La mejor botillería de Santiago"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<head />
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						<Toaster />
						<AuthProvider>{children}</AuthProvider>
						<TailwindIndicator />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
