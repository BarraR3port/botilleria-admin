"use client";

import { BadgePercent, Beer, Box, DollarSign, History, List, Paperclip, Plus, Receipt, Tag, Users } from "lucide-react";
import Link from "next/link";
import { UserIcon } from "../layout/Header/UserIcon";
import { Separator } from "../ui/separator";
import { Nav } from "./nav";

export default function Panel({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-full flex-row">
			<nav className="flex flex-col bg-primary-900 ">
				<div className={"flex h-14 items-center justify-center md:px-2"}>
					<Link className={"flex items-center space-x-2"} href="/panel">
						<Beer size={24} />
						<span className={"hidden md:flex font-bold text-lg tracking-wider hover:text-primary"}>
							Panel
						</span>
					</Link>
				</div>
				<div className="flex-grow overflow-y-auto scroll-auto ">
					<Separator />
					<Nav
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
								href: "/panel/sales"
							},
							{
								title: "Inventario",
								label: "",
								icon: Box,
								href: "/panel/products",
								subLinks: [
									{
										title: "Ver inventario",
										label: "",
										icon: List,
										href: "/panel/products",
										hasPrevious: true
									},
									{
										title: "Crear producto",
										label: "",
										icon: Plus,
										href: "/panel/products/create",
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
												title: "Ver marcas",
												label: "",
												icon: List,
												href: "/panel/products/brands",
												hasPrevious: true
											},
											{
												title: "Crear marca",
												label: "",
												icon: Plus,
												href: "/panel/products/brands/create",
												hasPrevious: true
											}
										]
									},
									{
										title: "Descuentos",
										label: "",
										icon: BadgePercent,
										href: "/panel/products/discounts",
										hasPrevious: true,
										subLinks: [
											{
												title: "Ver descuentos",
												label: "",
												icon: List,
												href: "/panel/products/discounts",
												hasPrevious: true
											},
											{
												title: "Crear descuento",
												label: "",
												icon: Plus,
												href: "/panel/products/discounts/create",
												hasPrevious: true
											}
										]
									}
								]
							},
							{
								title: "Pedidos",
								label: "",
								icon: Receipt,
								href: "/panel/orders",
								subLinks: [
									{
										title: "Ver pedidos",
										label: "",
										icon: List,
										href: "/panel/orders",
										hasPrevious: true
									},
									{
										title: "Crear pedido",
										label: "",
										icon: Plus,
										href: "/panel/orders/create",
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
										title: "Ver usuarios",
										label: "",
										icon: List,
										href: "/panel/users",
										hasPrevious: true
									},
									{
										title: "Crear usuario",
										label: "",
										icon: Plus,
										href: "/panel/users/create",
										hasPrevious: true
									}
								]
							}
							/* {
								title: "Settings",
								label: "",
								icon: Settings,
								href: "/panel/settings"
							} */
						]}
					/>
				</div>
				<Separator />
				<div className="gap-4 p-2">
					<UserIcon />
				</div>
			</nav>
			<Separator orientation="vertical" />
			<div className="flex flex-col flex-1 gap-4 md:p-4 md:gap-8 max-h-full max-w-full overflow-auto">
				{children}
			</div>
		</div>
	);
}
