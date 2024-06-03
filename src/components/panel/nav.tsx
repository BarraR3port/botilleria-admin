"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { buttonVariants } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavLink = {
	title: string;
	label?: string;
	icon: LucideIcon;
	href: string;
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
			return pathName.includes(link.href) ? "default" : "ghost";
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
			<nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
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
											"dark:bg-background-container-secondary dark:text-muted-foreground dark:hover:bg-background-container-secondary dark:hover:text-white"
									)}
								>
									<link.icon className="w-4 h-4" />
									<span className="sr-only">{link.title}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-4">
								{link.title}
								{link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
							</TooltipContent>
						</Tooltip>
					) : (
						<Link
							key={index}
							href={link.href}
							className={cn(
								buttonVariants({
									variant: linkVariant,
									size: "sm"
								}),
								linkVariant === "default" &&
									"dark:bg-background-container-secondary dark:text-white dark:hover:bg-background-container-secondary dark:hover:text-white",
								"justify-start"
							)}
						>
							<link.icon className="w-4 h-4 mr-2" />
							{link.title}
							{link.label && (
								<span
									className={cn(
										"ml-auto",
										linkVariant === "default" && "text-background dark:text-white"
									)}
								>
									{link.label}
								</span>
							)}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
