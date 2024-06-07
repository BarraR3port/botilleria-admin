"use client";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@ui/button";

interface CellActionProps {
	value: any;
}

export default function CellIdAction({ value }: CellActionProps) {
	function onCopy() {
		navigator.clipboard.writeText(`${value}`);
		toast({
			title: "Copiado al portapapeles",
			variant: "success",
			duration: 1500
		});
	}

	return (
		<Button variant="ghost" className="m-0" onClick={onCopy}>
			<span className="sr-only">Copiar al portapapeles</span>
			{value}
		</Button>
	);
}
