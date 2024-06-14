"use client";

import DeleteButton from "@/components/panel/delete-button";
import { Button } from "@ui/button";
import { Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Column } from "./Column";

interface CellActionProps {
	sale: Column;
}

export default function CellAction({ sale }: CellActionProps) {
	const { data: session } = useSession();
	return (
		<div>
			<Link href={`/panel/sales/${sale.id}`}>
				<Button variant="ghost">
					<Eye className="h-4 w-4 hover:cursor-pointer hover:text-blue-400" />
				</Button>
			</Link>
			<DeleteButton type="sales" session={session} itemId={sale.id} />
		</div>
	);
}
