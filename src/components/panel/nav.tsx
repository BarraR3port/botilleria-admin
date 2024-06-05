"use client";

import { Box, ChevronRightIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { buttonVariants } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import NavLinkComp from "./nav-link";

export type NavLink = {
	title: string;
	label?: string;
	icon: LucideIcon;
	href: string;
	subLinks?: NavLink[];
	hasPrevious?: boolean;
};

interface NavProps {
	isCollapsed: boolean;
	links: NavLink[];
	bottom?: boolean;
}

export function Nav({ links, isCollapsed, bottom }: NavProps) {
	const pathName = usePathname();

	const variant = useCallback(
		(link: NavLink) => {
			return pathName === link.href && link?.subLinks === undefined ? "default" : "ghost";
		},
		[isCollapsed, links, pathName]
	);
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
					const linkVariant = variant(link);
					return isCollapsed ? (
						<Tooltip key={index} delayDuration={0}>
							<TooltipTrigger asChild>
								<Link
									href={link.href}
									className={cn(
										buttonVariants({
											variant: linkVariant,
											size: "icon"
										}),
										"w-9 h-9",
										linkVariant === "default" &&
											"dark:bg-background-container-secondary  dark:hover:bg-background-container-secondary dark:hover:bg-background-container-secondary"
									)}
								>
									<link.icon className="w-4 h-4 " />
									<span className="sr-only">{link.title}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-4">
								{link.title}
								{link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
							</TooltipContent>
						</Tooltip>
					) : (
						<NavLinkComp key={index} link={link} />
					);
				})}
			</nav>
		</div>
	);
}
