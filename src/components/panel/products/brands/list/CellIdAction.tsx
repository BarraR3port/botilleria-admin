import { toast } from "@/components/ui/use-toast";
import { Button } from "@ui/button";
import type { Column } from "./Column";

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
