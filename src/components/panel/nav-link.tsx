"use client";

import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { buttonVariants } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { NavLinkType } from "./nav";

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
					router.push(link.href);
				}}
			>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<div>
							<link.icon className="w-4 h-4 " />
							<span className="sr-only">{link.title}</span>
						</div>
					</TooltipTrigger>
					<TooltipContent side="right" className="flex items-center gap-4">
						{link.title}
						{link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>}
					</TooltipContent>
				</Tooltip>
			</CollapsibleTrigger>
			{link.subLinks && (
				<CollapsibleContent className=" my-2 space-y-1">
					{link.subLinks?.map((subLink, index) => (
						<NavLink key={index} link={subLink} />
					))}
				</CollapsibleContent>
			)}
		</Collapsible>
	);
}
