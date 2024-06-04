"use client";

import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { Copy } from "lucide-react";
import type { Column } from "./Column";
import { toast } from "@/components/ui/use-toast";

interface CellActionProps {
	product: Column;
}

export default function CellIdAction({ product }: CellActionProps) {
	function onCopy() {
		navigator.clipboard.writeText(`${product.id}`);
		toast({
			title: "Id copiado al portapapeles",
			variant: "success",
			duration: 1500
		});
	}

	return (
		<Button variant="ghost" className="m-x-1 m-0" onClick={onCopy}>
			<span className="sr-only">Abrir menu</span>
			{product.id}
		</Button>
	);
}
