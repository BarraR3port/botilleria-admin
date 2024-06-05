import PanelHeader from "@/components/panel/panel-header";

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return <PanelHeader>{children}</PanelHeader>;
}
