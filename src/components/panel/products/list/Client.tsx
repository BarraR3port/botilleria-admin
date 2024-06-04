"use client";

import { Button } from "@ui/button";
import { DataTable } from "@ui/data-table";
import Heading from "@ui/heading";
import { Separator } from "@ui/separator";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Column, columns } from "./Column";

interface ClientProps {
	products: Column[];
}

export function Client({ products }: ClientProps) {
	const router = useRouter();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading title={`Productos (${products.length})`} mainPath="/panel/products" />
				<Button
					onClick={() => {
						router.push("/panel/products/new");
					}}
					variant="outline"
				>
					<Plus className="mr-2 w-4 h-4" />
					Crear Producto
				</Button>
			</div>
			<Separator />
			<DataTable columns={columns} data={products} searchKey="name" />
		</>
	);
}
