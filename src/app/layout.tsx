import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/footer";
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
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						<Toaster />
						<div className="flex flex-col min-h-[100dvh]">
							<SessionProvider>
								<Header />
								<div className="min-h-[calc(100dvh-6rem)]">{children}</div>
								<Footer />
							</SessionProvider>
						</div>
						<TailwindIndicator />
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
