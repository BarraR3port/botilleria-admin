import Panel from "@/components/panel/panel";
import AuthProvider from "@/providers/RouteProtector";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Botillería La Tía | Panel de administración",
	description: "La mejor botillería de Santiago"
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<Panel>{children}</Panel>
		</AuthProvider>
	);
}
