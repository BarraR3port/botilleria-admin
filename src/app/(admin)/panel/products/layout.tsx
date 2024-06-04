import PanelHeader from "@/components/panel/panel-header";
import Link from "next/link";

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<PanelHeader
			title={
				<div className="gap-4 flex">
					<Link href="/panel/products">
						<h1 className="text-2xl font-bold">Productos</h1>
					</Link>
					<Link href="/panel/products/brands">
						<h1 className="text-2xl font-bold">Marcas</h1>
					</Link>
				</div>
			}
		>
			{children}
		</PanelHeader>
	);
}
