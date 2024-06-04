"use client";

import { Button } from "@ui/button";
import { DataTable } from "@ui/data-table";
import Heading from "@ui/heading";
import { Separator } from "@ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Column, columns } from "./Column";

interface ClientProps {
	brands: Column[];
}

export function Client({ brands }: ClientProps) {
	const router = useRouter();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading title={`Marcas (${brands.length})`} description="Marcas de la botillería" />
				<Button
					onClick={() => {
						router.push("/panel/products/brands/new");
					}}
					variant="outline"
				>
					<Plus className="mr-2 w-4 h-4" />
					Crear Marca
				</Button>
			</div>
			<Separator />
			<DataTable columns={columns} data={brands} searchKey="name" />
		</>
	);
}
