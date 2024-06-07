"use client";

import { Button } from "@ui/button";
import { DataTable } from "@ui/data-table";
import Heading from "@ui/heading";
import { Separator } from "@ui/separator";
import { Plus, Tag } from "lucide-react";
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
				<div className="flex items-center gap-2">
					<Tag className="h-6 w-6" />
					<Heading title={"Marcas"} mainPath="/panel/products/brands" />
				</div>
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
			<DataTable columns={columns} data={brands} searchKeys={SEARCH_KEYS} />
		</>
	);
}

const SEARCH_KEYS = [
	{
		value: "name",
		label: "Marca"
	},
	{
		value: "id",
		label: "Id"
	},
	{
		value: "description",
		label: "Descripción"
	},
	{
		value: "createdAt",
		label: "Creado"
	}
];
