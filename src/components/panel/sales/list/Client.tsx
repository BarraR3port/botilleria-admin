"use client";

import { Button } from "@ui/button";
import { DataTable } from "@ui/data-table";
import Heading from "@ui/heading";
import { Separator } from "@ui/separator";
import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Column, columns } from "./Column";

interface ClientProps {
	sales: Column[];
}

export function Client({ sales }: ClientProps) {
	const router = useRouter();

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Package className="h-6 w-6" />
					<Heading title={"Productos"} mainPath="/panel/products" />
				</div>
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
			<DataTable columns={columns} data={sales} searchKeys={SEARCH_KEYS} />
		</>
	);
}

const SEARCH_KEYS = [
	{
		value: "total",
		label: "Total"
	},
	{
		value: "id",
		label: "Id"
	},
	{
		value: "user.name",
		label: "Usuario"
	},
	{
		value: "price",
		label: "Precio"
	},
	{
		value: "weightOrVolume",
		label: "Peso o Volumen"
	},
	{
		value: "available",
		label: "Disponible"
	},
	{
		value: "createdAt",
		label: "Creado"
	}
];
