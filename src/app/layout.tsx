import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/ui/tailwindcss-indicator";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SessionProvider from "@/providers/SessionProvider";

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
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						<Toaster />
						<div className="flex flex-col h-[100dvh]">
							<SessionProvider>{children}</SessionProvider>
						</div>
						<TailwindIndicator />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
