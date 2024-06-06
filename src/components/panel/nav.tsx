"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import NavLink from "./nav-link";
import NavLinkExpanded from "./nav-link-expanded";

export type NavLinkType = {
	title: string;
	label?: string;
	icon: LucideIcon;
	href: string;
	subLinks?: NavLinkType[];
	hasPrevious?: boolean;
};

interface NavProps {
	isCollapsed: boolean;
	links: NavLinkType[];
	bottom?: boolean;
}

export function Nav({ links, isCollapsed, bottom }: NavProps) {
	return (
		<div
			data-collapsed={isCollapsed}
			className={cn(
				"group flex flex-col gap-4 py-2",
				bottom ? "mt-auto flex-grow" : "flex-grow",
				isCollapsed ? "data-collapsed=true:py-2" : ""
			)}
		>
			<nav className="grid gap-1 space-y-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{links.map((link, index) => {
					return isCollapsed ? (
						<NavLink key={index} link={link} />
					) : (
						<NavLinkExpanded key={index} link={link} />
					);
				})}
			</nav>
		</div>
	);
}
export { NavLink };
