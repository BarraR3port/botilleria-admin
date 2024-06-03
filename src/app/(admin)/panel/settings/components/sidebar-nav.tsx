"use client";

import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
	}[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
	const pathname = usePathname();

	return (
		<nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2", className)} {...props}>
			{items.map(item => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						buttonVariants({ variant: "ghost" }),
						pathname.endsWith(item.href)
							? "bg-background-container-secondary hover:bg-background-container-secondary "
							: "hover:bg-background-container-secondary/60",
						"justify-start"
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
}
