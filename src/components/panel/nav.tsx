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
	links: NavLinkType[];
	bottom?: boolean;
}

export function Nav({ links, bottom }: NavProps) {
	return (
		<div className={cn("group flex flex-col gap-4 py-2", bottom ? "mt-auto flex-grow" : "flex-grow")}>
			<nav className="grid gap-1 space-y-1 px-2 ">
				{links.map((link, index) => {
					return (
						<div key={index}>
							<div className="block md:hidden">
								<NavLink link={link} />
							</div>
							<div className="hidden md:block">
								<NavLinkExpanded link={link} />
							</div>
						</div>
					);
				})}
			</nav>
		</div>
	);
}
export { NavLink };
