"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Separator } from "../ui/separator";

export default function PanelTitle() {
	const pathName = usePathname();
	return (
		<div className="gap-4 flex">
			<Link href="/panel/products">
				<h1
					className={cn(
						!pathName.startsWith("/panel/products/brands")
							? "text-2xl font-bold text-white"
							: "text-2xl font-bold text-white/60"
					)}
				>
					Productos
				</h1>
			</Link>
			<Separator orientation="vertical" />
			<Link href="/panel/products/brands">
				<h1
					className={cn(
						pathName.startsWith("/panel/products/brands")
							? "text-2xl font-bold text-white"
							: "text-2xl font-bold text-white/60"
					)}
				>
					Marcas
				</h1>
			</Link>
		</div>
	);
}
