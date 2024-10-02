"use client";

import DeleteButton from "@/components/panel/delete-button";
import { Button } from "@ui/button";
import { Edit } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Column } from "./Column";

interface CellActionProps {
	brand: Column;
}

export default function CellAction({ brand }: CellActionProps) {
	const { data: session } = useSession();
	return (
		<div>
			<Link href={`/panel/products/brands/${brand.id}`}>
				<Button variant="ghost">
					<Edit className="h-4 w-4 hover:cursor-pointer" />
				</Button>
			</Link>
			<DeleteButton type="products/brands" session={session} itemId={brand.id} />
		</div>
	);
}
