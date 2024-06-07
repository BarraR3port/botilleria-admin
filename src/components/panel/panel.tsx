"use client";

import { cn } from "@/lib/utils";
import { Beer, Box, DollarSign, List, Plus, Settings, Tag, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { UserIcon } from "../layout/Header/UserIcon";
import { buttonVariants } from "../ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { Nav } from "./nav";

export default function Panel({
	defaultCollapsed,
	defaultLayout,
	children
}: { defaultCollapsed: boolean; defaultLayout: number[]; children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
	const dashboardLayout = useMemo(() => defaultLayout || [0, 1], [defaultLayout]);

	return (
		<ResizablePanelGroup
			direction="horizontal"
			onLayout={(sizes: number[]) => {
				document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}; max-age=31536000; path=/`;
			}}
			className="items-stretch h-full"
			id="group"
		>
			<ResizablePanel
				defaultSize={dashboardLayout[0]}
				collapsible={true}
				minSize={13}
				maxSize={13}
				onResize={(size: number) => {
					if (size <= 13) {
						setIsCollapsed(true);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							true
						)}; max-age=31536000; path=/`;
					} else {
						setIsCollapsed(false);
						document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
							false
						)}; max-age=31536000; path=/`;
					}
				}}
				onCollapse={() => {
					setIsCollapsed(true);
					document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
				}}
				onExpand={() => {
					setIsCollapsed(false);
					document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
				}}
				className={cn(
					" h-screen flex flex-col overflow-y-auto scrollbar-width-thin",
					isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
				)}
			>
				<div className={cn("flex h-14 items-center justify-center", isCollapsed ? "h-14" : "px-2")}>
					<Link
						className={cn(
							isCollapsed
								? buttonVariants({
										variant: "ghost",
										size: "icon"
									})
								: undefined,
							"flex items-center space-x-2"
						)}
						href="/panel"
					>
						<Beer size={24} />
						{!isCollapsed && (
							<span className={"font-bold text-lg tracking-wider hover:text-primary"}>Panel</span>
						)}
					</Link>
				</div>
				<div className="flex-grow overflow-y-auto scroll-auto ">
					<Separator />
					<Nav
						isCollapsed={isCollapsed}
						links={[
							{
								title: "Panel",
								label: "",
								icon: Beer,
								href: "/panel"
							},
							{
								title: "Ventas",
								label: "",
								icon: DollarSign,
								href: "/panel/sales",
								subLinks: [
									{
										title: "Ventas",
										label: "",
										icon: List,
										href: "/panel/sales",
										hasPrevious: true
									},
									{
										title: "Descuentos",
										label: "",
										icon: Tag,
										href: "/panel/sales/discounts",
										hasPrevious: true,
										subLinks: [
											{
												title: "Descuentos",
												label: "",
												icon: List,
												href: "/panel/sales/discounts",
												hasPrevious: true
											},
											{
												title: "Crear Descuento",
												label: "",
												icon: Plus,
												href: "/panel/sales/discounts/new",
												hasPrevious: true
											}
										]
									}
								]
							},
							{
								title: "Productos",
								label: "",
								icon: Box,
								href: "/panel/products",
								subLinks: [
									{
										title: "Productos",
										label: "",
										icon: List,
										href: "/panel/products",
										hasPrevious: true
									},
									{
										title: "Marcas",
										label: "",
										icon: Tag,
										href: "/panel/products/brands",
										hasPrevious: true,
										subLinks: [
											{
												title: "Marcas",
												label: "",
												icon: List,
												href: "/panel/products/brands",
												hasPrevious: true
											},
											{
												title: "Crear Marca",
												label: "",
												icon: Plus,
												href: "/panel/products/brands/new",
												hasPrevious: true
											}
										]
									},
									{
										title: "Crear Producto",
										label: "",
										icon: Plus,
										href: "/panel/products/new",
										hasPrevious: true
									}
								]
							},
							{
								title: "Usuarios",
								label: "",
								icon: Users,
								href: "/panel/users",
								subLinks: [
									{
										title: "Usuarios",
										label: "",
										icon: List,
										href: "/panel/users",
										hasPrevious: true
									},
									{
										title: "Crear Usuario",
										label: "",
										icon: Plus,
										href: "/panel/users/new",
										hasPrevious: true
									}
								]
							},
							{
								title: "Settings",
								label: "",
								icon: Settings,
								href: "/panel/settings"
							}
						]}
					/>
				</div>
				<Separator />
				<div className="gap-4 p-2">
					<UserIcon navBar={!isCollapsed} />
				</div>
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel defaultSize={dashboardLayout[1]}>
				<div className="flex flex-col flex-1 gap-4 p-4 md:gap-8 max-h-full">{children}</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
