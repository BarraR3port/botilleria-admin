"use client";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon } from "./UserIcon";

export default function Header() {
	const pathName = usePathname();
	if (pathName.includes("dashboard")) {
		return null;
	}
	return (
		<header className="container flex items-center justify-between px-4 h-14 ">
			<div className="hidden space-x-2 md:flex">
				<nav className="hidden gap-4 md:flex lg:gap-6">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/panel" className={navigationMenuTriggerStyle()}>
									Panel
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/panel/products" className={navigationMenuTriggerStyle()}>
									Productos
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/panel/sales" className={navigationMenuTriggerStyle()}>
									Ventas
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/panel/settings" className={navigationMenuTriggerStyle()}>
									Ajustes
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</nav>
			</div>
			<Sheet>
				<SheetTrigger asChild>
					<Button className="shrink-0 md:hidden" size="icon" variant="outline">
						<MenuIcon className="w-5 h-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium">
						<SheetPrimitive.Close asChild>
							<Link className="flex items-center space-x-2" href="/">
								<span className={"font-bold text-lg tracking-wider hover:text-primary"}>
									Panel de Administración
								</span>
							</Link>
						</SheetPrimitive.Close>
						<SheetPrimitive.Close asChild>
							<Link href="/panel" className={navigationMenuTriggerStyle()}>
								Panel
							</Link>
						</SheetPrimitive.Close>
						<SheetPrimitive.Close asChild>
							<Link href="/panel/products" className={navigationMenuTriggerStyle()}>
								Productos
							</Link>
						</SheetPrimitive.Close>
						<SheetPrimitive.Close asChild>
							<Link href="/panel/sales" className={navigationMenuTriggerStyle()}>
								Ventas
							</Link>
						</SheetPrimitive.Close>
						<SheetPrimitive.Close asChild>
							<Link href="/panel/settings" className={navigationMenuTriggerStyle()}>
								Ajustes
							</Link>
						</SheetPrimitive.Close>
					</nav>
				</SheetContent>
			</Sheet>
			<div className="items-center gap-4 ">
				<UserIcon />
			</div>
		</header>
	);
}
