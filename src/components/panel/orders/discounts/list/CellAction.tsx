"use client";

import DeleteButton from "@/components/panel/delete-button";
import { Button } from "@ui/button";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Column } from "./Column";

interface CellActionProps {
	discount: Column;
}

export default function CellAction({ discount }: CellActionProps) {
	const { data: session } = useSession();
	return (
		<div>
			<Link href={`/panel/products/discounts/${discount.id}`}>
				<Button variant="ghost">
					<Edit className="h-6 w-6 hover:cursor-pointer" />
				</Button>
			</Link>
			<DeleteButton type="products/discounts" session={session} itemId={discount.id} />
		</div>
	);
}
