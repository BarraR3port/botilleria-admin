"use client";

import DeleteButton from "@/components/panel/delete-button";
import { Button } from "@ui/button";
import { Edit, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Column } from "./Column";

interface CellActionProps {
	product: Column;
}

export default function CellAction({ product }: CellActionProps) {
	const { data: session } = useSession();
	return (
		<div>
			<Link href={`/panel/orders/${product.id}`}>
				<Button variant="ghost">
					<Eye className="h-4 w-4 hover:cursor-pointer hover:text-blue-400" />
				</Button>
			</Link>
			<Link href={`/panel/orders/edit/${product.id}`}>
				<Button variant="ghost">
					<Edit className="h-4 w-4 hover:cursor-pointer" />
				</Button>
			</Link>
			<DeleteButton type="orders" session={session} itemId={product.id} />
		</div>
	);
}
