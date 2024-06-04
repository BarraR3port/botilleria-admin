import PanelHeader from "@/components/panel/panel-header";
import PanelTitle from "@/components/panel/panel-title";

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return <PanelHeader title={<PanelTitle />}>{children}</PanelHeader>;
}
