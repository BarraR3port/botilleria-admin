import PanelHeader from "@/components/panel/panel-header";
import { SidebarNav } from "./components/sidebar-nav";

const sidebarNavItems = [
	{
		title: "Profile",
		href: "/panel/settings"
	},
	{
		title: "Account",
		href: "/panel/settings/account"
	},
	{
		title: "Appearance",
		href: "/panel/settings/appearance"
	},
	{
		title: "Notifications",
		href: "/panel/settings/notifications"
	},
	{
		title: "Display",
		href: "/panel/settings/display"
	}
];

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<PanelHeader>
			<div className="flex flex-col space-y-8 overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="sticky px-4 overflow-x-auto overflow-y-clip xl:px-0">
					<SidebarNav items={sidebarNavItems} />
				</aside>
				<div className="flex-1 px-8 overflow-auto md:block">
					<div className="flex-1 lg:max-w-4xl">{children}</div>
				</div>
			</div>
		</PanelHeader>
	);
}
