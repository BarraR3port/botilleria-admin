import PanelHeader from "@/components/panel/panel-header";

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return <PanelHeader title={<h1 className="text-2xl font-bold">Usuarios</h1>}>{children}</PanelHeader>;
}
