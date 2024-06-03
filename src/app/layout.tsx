import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TailwindIndicator } from "@/components/ui/tailwindcss-indicator";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/Header/Header";

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
						<div className="flex flex-col min-h-[100dvh]">
							<Header />
							<AuthProvider>
								<div className="min-h-[calc(100dvh-6rem)]">{children}</div>
							</AuthProvider>
							<Footer />
						</div>
						<TailwindIndicator />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
