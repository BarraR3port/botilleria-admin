import Panel from "@/components/panel/panel";
import AuthProvider from "@/providers/RouteProtector";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	title: "Botillería La Tía | Panel de administración",
	description: "La mejor botillería de Santiago"
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const layout = cookies().get("react-resizable-panels:layout");
	const collapsed = cookies().get("react-resizable-panels:collapsed");

	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
	return (
		<AuthProvider>
			<Panel defaultCollapsed={defaultCollapsed} defaultLayout={defaultLayout}>
				{children}
			</Panel>
		</AuthProvider>
	);
}
