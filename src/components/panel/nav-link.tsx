"use client";

import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { buttonVariants } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import type { NavLink as NavLinkType } from "./nav";

interface NavLinkProps {
	link: NavLinkType;
}

export default function NavLink({ link }: NavLinkProps) {
	const router = useRouter();
	const pathName = usePathname();

	const isSelected = useMemo(() => {
		return pathName === link.href;
	}, [link, link?.subLinks, pathName]);

	const variant = useMemo(() => {
		return isSelected ? "default" : "ghost";
	}, [link, isSelected]);

	return (
		<Collapsible
			className={cn(
				"group  ",
				pathName.startsWith(link.href) &&
					link?.subLinks &&
					"rounded-lg bg-primary text-primary-foreground shadow "
			)}
		>
			<CollapsibleTrigger
				className={cn(
					buttonVariants({
						variant: !link?.subLinks ? (isSelected && link.hasPrevious ? "secondary" : variant) : "ghost",
						size: "sm"
					}),
					"justify-between w-full [&[data-state=open]>svg]:rotate-90"
				)}
				onClick={() => {
					if (!link?.subLinks) router.push(link.href);
				}}
			>
				<div className="flex">
					<link.icon className="w-4 h-4 mr-2" />
					{link.title}
					{link.label && (
						<span className={cn("ml-auto", variant === "default" && "text-background dark:text-white")}>
							{link.label}
						</span>
					)}
				</div>
				{link.subLinks && <ChevronRightIcon className="h-5 w-5 transition-transform" />}
			</CollapsibleTrigger>
			{link.subLinks && (
				<CollapsibleContent className="px-4 my-2 space-y-1">
					{link.subLinks?.map((subLink, index) => (
						<NavLink key={index} link={subLink} />
					))}
				</CollapsibleContent>
			)}
		</Collapsible>
	);
}
